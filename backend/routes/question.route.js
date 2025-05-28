// import express from "express";
// import {
//   addQuestion,
//   getQuestions,
//   getExamSettings,
//   submitExamCode,
//   runExamCode,
//   getStudentSubmissions,
//   assignMarks,
//   getStudentsWithSubmissions,
//   getExamResult,
// } from "../controllers/question.controller.js";
// import ExamSettings from "../models/ExamSettings.js";

// const router = express.Router();


// router.post("/add",  addQuestion);
// router.get("/",  getQuestions);
// router.get("/exam-settings/:subjectName",  getExamSettings);
// router.post("/exam/submit",  submitExamCode);
// router.post("/exam/run",  runExamCode);
// router.get("/submissions/:studentId", getStudentSubmissions);
// router.post("/assign-marks", assignMarks);
// router.get("/students-with-submissions", getStudentsWithSubmissions);
// router.get("/exam-result/:studentId", getExamResult);

// // Test endpoint for ExamSettings
// router.post("/test-exam-settings",  async (req, res) => {
//   try {
//     const { subjectName, examDuration } = req.body;
//     // console.log("Test endpoint received:", { subjectName, examDuration }); // Debug log
//     if (!subjectName || !examDuration || isNaN(examDuration) || examDuration <= 0) {
//       return res.status(400).json({ message: "subjectName and a valid examDuration (positive number) are required." });
//     }
//     const settings = await ExamSettings.findOneAndUpdate(
//       { subjectName },
//       { examDuration },
//       { upsert: true, new: true }
//     );
//     // console.log("Test endpoint result:", settings); // Debug log
//     res.status(200).json(settings);
//   } catch (error) {
//     console.error("Error in test-exam-settings:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });

// export default router;


import express from "express";
import {
  addQuestion,
  getQuestions,
  getExamSettings,
  submitExamCode,
  runExamCode,
  runAndTestCode, // New function for automated testing
  getStudentSubmissions,
  assignMarks,
  getStudentsWithSubmissions,
  getExamResult,
} from "../controllers/question.controller.js";
import ExamSettings from "../models/ExamSettings.js";

const router = express.Router();

router.post("/add", addQuestion);
router.get("/", getQuestions);
router.get("/exam-settings/:subjectName", getExamSettings);
router.post("/exam/submit", submitExamCode);
router.post("/exam/run", runExamCode);
router.post("/exam/test", runAndTestCode); // New endpoint for testing against test cases
router.get("/submissions/:studentId", getStudentSubmissions);
router.post("/assign-marks", assignMarks);
router.get("/students-with-submissions", getStudentsWithSubmissions);
router.get("/exam-result/:studentId", getExamResult);

// Test endpoint for ExamSettings
router.post("/test-exam-settings", async (req, res) => {
  try {
    const { subjectName, examDuration } = req.body;
    if (!subjectName || !examDuration || isNaN(examDuration) || examDuration <= 0) {
      return res.status(400).json({ message: "subjectName and a valid examDuration (positive number) are required." });
    }
    const settings = await ExamSettings.findOneAndUpdate(
      { subjectName },
      { examDuration },
      { upsert: true, new: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error in test-exam-settings:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;