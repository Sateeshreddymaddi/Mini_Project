import Question from "../models/Question.js";

export const addQuestion = async (req, res) => {
  try {
    const questionsData = req.body.questions; // expecting an array of question objects
    if (!questionsData || !Array.isArray(questionsData) || questionsData.length === 0) {
      return res.status(400).json({ error: "No questions provided" });
    }

    const createdQuestions = [];
    for (const q of questionsData) {
      const { title, description, testCases, subject, teacher, marks } = q;
      if (!title || !description || !subject || !teacher || !marks) {
        return res.status(400).json({ error: "Missing required fields for one or more questions" });
      }
      const newQuestion = new Question({ title, description, testCases, subject, teacher, marks });
      await newQuestion.save();
      createdQuestions.push(newQuestion);
    }
    res.status(201).json({ message: "Questions added successfully", questions: createdQuestions });
  } catch (error) {
    console.error("Error in addQuestion controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error in getQuestions controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
