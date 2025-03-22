import Submission from "../models/Submission.js";
import Student from "../models/Student.js";
import Question from "../models/Question.js";
import axios from "axios";

// Helper function to execute code using Judge0 API
const executeCode = async (code, language) => {
  const languageIds = {
    python: 71,
    java: 62,
    cpp: 54,
    c: 50,
    javascript: 63,
    ruby: 72,
    php: 68,
    csharp: 51,
    go: 60,
    kotlin: 78,
    swift: 83,
    rust: 73
  };

  const languageId = languageIds[language];
  if (!languageId) {
    throw new Error(`Language ${language} not supported.`);
  }

  const submissionResponse = await axios.post(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
    {
      source_code: code,
      language_id: languageId,
    },
    {
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": "5fbb1b6577msh94f77a56281f31cp1c73dejsn06af7aa06c59" // Replace with your own Judge0 key
      },
    }
  );

  const token = submissionResponse.data.token;
  let result;
  const pollForResult = async () => {
    const resultResponse = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
      {
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": "5fbb1b6577msh94f77a56281f31cp1c73dejsn06af7aa06c59"
        },
      }
    );
    result = resultResponse.data;
    if (result.status.id < 3) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return pollForResult();
    }
    return result;
  };

  await pollForResult();

  if (result.stdout) {
    return result.stdout;
  } else if (result.compile_output) {
    return result.compile_output;
  } else if (result.stderr) {
    return result.stderr;
  } else {
    return "No output.";
  }
};

export const submitExamCode = async (req, res) => {
  try {
    const { questionId, code, language, studentId } = req.body;
    
    // Check if the student already submitted for this question
    const existingSubmission = await Submission.findOne({
      student: studentId,
      question: questionId,
    });
    if (existingSubmission) {
      return res.status(400).json({ message: "You have already attempted this question." });
    }
    
    // Compile the code and get its output
    const output = await executeCode(code, language);

    // Create and save a new submission
    const submission = new Submission({
      student: studentId,
      question: questionId,
      code,
      output,
    });

    await submission.save();
    res.status(200).json({ message: "Code submitted", output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const runExamCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const output = await executeCode(code, language);
    res.status(200).json({ output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ output: "Internal server error" });
  }
};

export const getStudentSubmissions = async (req, res) => {
  try {
    const { studentId } = req.params;
    // If you do not actually filter by subjectName, you can remove this
    const { subjectName } = req.query;

    const filter = { student: studentId };

    // IMPORTANT: If your question schema uses "subject" (NOT "subjectName"),
    // then we must match on { subject: subjectName } if subjectName is provided
    const matchQuery = subjectName ? { subject: subjectName } : {};

    // Populate the associated question with title, marks, and testCases
    const submissions = await Submission.find(filter).populate({
      path: "question",
      select: "title marks testCases subject",
      match: matchQuery,
    });

    // Filter out submissions that have no question or didn't match
    const filteredSubmissions = submissions.filter((sub) => sub.question !== null);
    res.status(200).json(filteredSubmissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Error fetching submissions", error });
  }
};

export const assignMarks = async (req, res) => {
  try {
    // Expect an array: [{ submissionId, marks }, ...]
    const { marksData } = req.body;
    if (!marksData || !Array.isArray(marksData)) {
      return res.status(400).json({ message: "Invalid marks data" });
    }

    const updatedSubmissions = [];
    for (const { submissionId, marks } of marksData) {
      // Retrieve the submission and populate the question to access max marks
      const submission = await Submission.findById(submissionId).populate("question");
      if (!submission) {
        return res.status(404).json({ message: `Submission ${submissionId} not found` });
      }

      const maxMarks = submission.question.marks;
      if (marks > maxMarks) {
        return res.status(400).json({
          message: `Assigned marks for question "${submission.question.title}" cannot exceed maximum marks of ${maxMarks}`
        });
      }

      const updated = await Submission.findByIdAndUpdate(
        submissionId,
        { marks },
        { new: true }
      );
      if (updated) {
        updatedSubmissions.push(updated);
      }
    }
    res.status(200).json({ message: "Marks assigned successfully", updatedSubmissions });
  } catch (error) {
    console.error("Error in assignMarks controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentsWithSubmissions = async (req, res) => {
  try {
    // "student" is the correct field name in the Submission model
    const studentIds = await Submission.distinct("student");

    // Fetch student details
    const students = await Student.find({ _id: { $in: studentIds } }).select("name email");

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students with submissions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getExamResult = async (req, res) => {
  try {
    const { studentId } = req.params;
    // Fetch all submissions for the student and populate the associated question's marks
    const submissions = await Submission.find({ student: studentId }).populate("question", "marks");
    let totalObtainedMarks = 0;
    let totalPossibleMarks = 0;
    submissions.forEach((sub) => {
      totalObtainedMarks += sub.marks || 0;
      if (sub.question && sub.question.marks) {
        totalPossibleMarks += sub.question.marks;
      }
    });
    res.status(200).json({ totalObtainedMarks, totalPossibleMarks });
  } catch (error) {
    console.error("Error fetching exam result:", error);
    res.status(500).json({ message: "Error fetching exam result", error });
  }
};