// import express from "express";
// import { AddQuestion } from "../controllers/auth.controller.js";
// import { Question } from "../models/Question.js";

// const router = express.Router();

// // GET /api/questions - Retrieve all questions
// router.get("/", async (req, res) => {
//   try {
//     const questions = await Question.find({});
//     res.status(200).json({ questions });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // POST /api/questions/add - Add questions
// router.post("/add", AddQuestion);

// export default router;

import express from "express";
import { addQuestion, getQuestions } from "../controllers/question.controller.js";
import { Question } from "../models/Question.js";

const router = express.Router();

// Dummy authentication middleware for testing purposes only.
// Replace this with your actual authentication middleware.
const dummyAuth = (req, res, next) => {
  req.user = { role: "teacher", id: "60d0fe4f5311236168a109ca" };
  next();
};

router.use(dummyAuth);

// Middleware to check if the user is admin or teacher.
const isAdminOrTeacher = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "teacher")) {
    return next();
  } else {
    return res.status(403).json({ message: "Access denied. Only admin or teacher can add questions." });
  }
};

// GET /api/questions - Retrieve all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/questions/add - Add questions (only accessible to admin and teacher)
router.post("/add", isAdminOrTeacher, addQuestion);

export default router;
