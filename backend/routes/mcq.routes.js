import express from "express";
import {
  addMcqQuestion,
  getMcqQuestions,
  submitMcqAnswer,
  getSubjectWiseReport,
  getMcqReport,
  getAvailableSubjects,
  getDetailedSubjectResult,
  getExamHistory
} from "../controllers/mcq.controller.js";

const router = express.Router();

router.post("/add", addMcqQuestion);
router.get("/all", getMcqQuestions);
router.post("/:studentId/submit-answers", submitMcqAnswer);
router.get("/subject-report/:studentId", getSubjectWiseReport);
router.get("/report/:user_id", getMcqReport);
router.get("/available-subjects", getAvailableSubjects);
router.get("/detailed-result/:studentId/:subjectName", getDetailedSubjectResult);
router.get("/:studentId/exam-history", getExamHistory);

export default router;
