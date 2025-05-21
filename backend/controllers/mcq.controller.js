import McqQuestion from "../models/McqQuestion.js";
import McqSubmission from "../models/McqSubmission.js";
import ExamSettings from "../models/ExamSettings.js";
import mongoose from "mongoose";

/** 
 * @desc Add new MCQ(s) and set exam duration
 * @route POST /api/mcq/add
 */
export const addMcqQuestion = async (req, res) => {
  try {
    const { questions, examDuration } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions must be an array with at least one question." });
    }
    if (!examDuration || isNaN(examDuration) || examDuration <= 0) {
      return res.status(400).json({ message: "A valid exam duration (positive number in minutes) is required." });
    }
    const subjectName = questions[0].subjectName;
    for (const q of questions) {
      if (
        !q.question_text ||
        !q.options ||
        !q.correct_option ||
        !q.created_by ||
        !q.subjectName ||
        q.marks == null
      ) {
        return res.status(400).json({ message: "All fields (including marks) are required." });
      }
      if (q.subjectName !== subjectName) {
        return res.status(400).json({ message: "All questions must have the same subjectName." });
      }
      if (!mongoose.Types.ObjectId.isValid(q.created_by)) {
        return res.status(400).json({ message: "Invalid teacher ID" });
      }
    }
    const insertedQuestions = await McqQuestion.insertMany(questions);
    await ExamSettings.findOneAndUpdate(
      { subjectName },
      { examDuration },
      { upsert: true }
    );
    return res.status(201).json({ message: "MCQs added successfully", questions: insertedQuestions });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

/** 
 * @desc Get all MCQs (filter by subjectName if provided)
 * @route GET /api/mcq/all
 */
export const getMcqQuestions = async (req, res) => {
  try {
    const { subjectName } = req.query;
    let filter = {};
    if (subjectName) {
      filter.subjectName = subjectName;
    }
    const questions = await McqQuestion.find(filter);
    res.status(200).json(questions);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

/** 
 * @desc Get exam settings for a subject
 * @route GET /api/mcq/exam-settings/:subjectName
 */
export const getExamSettings = async (req, res) => {
  try {
    const { subjectName } = req.params;
    const settings = await ExamSettings.findOne({ subjectName });
    if (!settings) {
      return res.status(404).json({ message: "Exam settings not found for this subject." });
    }
    res.status(200).json({ examDuration: settings.examDuration });
  } catch (error) {
    console.error("Error fetching exam settings:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

/** 
 * @desc Submit an MCQ answer and auto-evaluate 
 * @route POST /api/mcq/:studentId/submit-answers
 */
export const submitMcqAnswer = async (req, res) => {
  try {
    // console.log("Submit MCQ Answer request body:", req.body);
    const { studentId } = req.params;
    const { question_id, selected_option } = req.body;
    if (!studentId || !question_id || !selected_option) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(question_id)) {
      return res.status(400).json({ message: "Invalid studentId or questionId" });
    }
    // Check for existing submission
    const existingSubmission = await McqSubmission.findOne({
      user_id: studentId,
      question_id,
    });
    if (existingSubmission) {
      return res.status(400).json({ message: "Answer already submitted for this question" });
    }
    const question = await McqQuestion.findById(question_id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    const is_correct = question.correct_option === selected_option;
    const earnedMarks = is_correct ? question.marks : 0;
    const submission = new McqSubmission({
      user_id: studentId,
      question_id,
      selected_option,
      is_correct,
      subjectName: question.subjectName,
      question_marks: question.marks,
      marks_earned: earnedMarks,
    });
    await submission.save();
    return res.status(201).json({
      message: "Answer submitted successfully",
      submission,
      is_correct,
      earnedMarks,
    });
  } catch (error) {
    console.error("Error in submitMcqAnswer:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

/** 
 * @desc Get subject-wise performance report for a student 
 * @route GET /api/mcq/subject-report/:studentId
 */
export const getSubjectWiseReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid studentId. Please use a valid MongoDB ObjectId." });
    }
    const report = await McqSubmission.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: "$subjectName",
          totalQuestions: { $sum: 1 },
          correctAnswers: { $sum: { $cond: ["$is_correct", 1, 0] } },
          totalEarnedMarks: { $sum: "$marks_earned" },
          totalPossibleMarks: { $sum: "$question_marks" },
        },
      },
      {
        $project: {
          subjectName: "$_id",
          totalQuestions: 1,
          correctAnswers: 1,
          totalEarnedMarks: 1,
          totalPossibleMarks: 1,
          correctAnswerPercentage: {
            $cond: [
              { $eq: ["$totalQuestions", 0] },
              0,
              {
                $round: [
                  { $multiply: [{ $divide: ["$correctAnswers", "$totalQuestions"] }, 100] },
                  2,
                ],
              },
            ],
          },
          marksPercentage: {
            $cond: [
              { $eq: ["$totalPossibleMarks", 0] },
              0,
              {
                $round: [
                  { $multiply: [{ $divide: ["$totalEarnedMarks", "$totalPossibleMarks"] }, 100] },
                  2,
                ],
              },
            ],
          },
        },
      },
    ]);
    res.status(200).json(report);
  } catch (error) {
    console.error("Error in getSubjectWiseReport:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

/** 
 * @desc Get overall performance report for a student 
 * @route GET /api/mcq/report/:user_id
 */
export const getMcqReport = async (req, res) => {
  try {
    const { user_id } = req.params;
    const totalQuestions = await McqSubmission.countDocuments({ user_id });
    const correctAnswers = await McqSubmission.countDocuments({ user_id, is_correct: true });
    const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    res.json({
      user_id,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      score_percentage: scorePercentage,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

/**
 * @desc Get available subjects with MCQs
 * @route GET /api/mcq/available-subjects
 */
export const getAvailableSubjects = async (req, res) => {
  try {
    const subjects = await McqQuestion.distinct("subjectName");
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

/**
 * @desc Get exam history for a student
 * @route GET /api/mcq/:studentId/exam-history?subjectName=optional
 */
export const getExamHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const subjectName = req.query.subjectName;
    const filter = { user_id: studentId };
    if (subjectName) {
      filter.subjectName = subjectName;
    }
    const submissions = await McqSubmission.find(filter).populate("question_id");
    if (!submissions || submissions.length === 0) {
      return res.status(404).json({ message: "No exam history found." });
    }
    const history = submissions.reduce((acc, sub) => {
      const subj = sub.subjectName;
      if (!acc[subj]) {
        acc[subj] = {
          subjectName: subj,
          totalQuestions: 0,
          correctAnswers: 0,
          totalPossibleMarks: 0,
          totalEarnedMarks: 0,
          latestSubmission: sub.submitted_at,
          submissions: []
        };
      }
      acc[subj].totalQuestions += 1;
      if (sub.is_correct) {
        acc[subj].correctAnswers += 1;
      }
      acc[subj].totalPossibleMarks += sub.question_marks;
      acc[subj].totalEarnedMarks += sub.marks_earned;
      if (new Date(sub.submitted_at) > new Date(acc[subj].latestSubmission)) {
        acc[subj].latestSubmission = sub.submitted_at;
      }
      acc[subj].submissions.push(sub);
      return acc;
    }, {});
    const historyArray = Object.values(history).map(group => {
      group.scorePercentage = group.totalPossibleMarks > 0 
        ? parseFloat(((group.totalEarnedMarks / group.totalPossibleMarks) * 100).toFixed(2))
        : 0;
      group.latestSubmissionFormatted = new Date(group.latestSubmission).toLocaleString();
      return group;
    });
    res.status(200).json(historyArray);
  } catch (error) {
    console.error("Error fetching exam history:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

/**
 * @desc Get detailed result for a given subject for a student
 * @route GET /api/mcq/detailed-result/:studentId/:subjectName
 */
export const getDetailedSubjectResult = async (req, res) => {
  try {
    const { studentId, subjectName } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid studentId. Please use a valid MongoDB ObjectId." });
    }
    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const trimmedSubjectName = subjectName.trim();
    const submissions = await McqSubmission.find({
      user_id: studentObjectId,
      subjectName: { $regex: trimmedSubjectName, $options: "i" }
    }).populate("question_id");
    if (!submissions || submissions.length === 0) {
      return res.status(404).json({ message: "No submissions found for this subject." });
    }
    const detailedResults = submissions.map((sub) => ({
      questionText: sub.question_id ? sub.question_id.question_text : "Question not found",
      options: sub.question_id ? sub.question_id.options : [],
      correctOption: sub.question_id ? sub.question_id.correct_option : "",
      userAnswer: sub.selected_option,
      isCorrect: sub.is_correct,
      marksEarned: sub.marks_earned,
      totalMarks: sub.question_marks,
    }));
    res.status(200).json({ subjectName: trimmedSubjectName, detailedResults });
  } catch (error) {
    console.error("Error in getDetailedSubjectResult:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};