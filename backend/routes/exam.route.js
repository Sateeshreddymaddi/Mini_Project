import express from "express";
import { submitExamCode,
        runExamCode,
        getStudentSubmissions,
        assignMarks,
        getStudentsWithSubmissions,
        getExamResult
} from "../controllers/exam.controller.js";

const router = express.Router();

// POST /api/exam/submit - Receive and store a code submission
router.post("/submit", submitExamCode);
router.post("/run", runExamCode);
router.get("/:studentId/submissions", getStudentSubmissions);
router.get("/students-with-submissions", getStudentsWithSubmissions); 
router.put("/assign-marks", assignMarks);
router.get("/result/:studentId", getExamResult);

export default router;
