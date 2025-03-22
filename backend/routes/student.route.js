import express from "express";
import { addStudents, studentLogin, getStudent, updateStudent } from "../controllers/student.controller.js";
import { upload } from "../multerConfig.js"; // Updated to use memory storage

const router = express.Router();

router.post("/add", addStudents);
router.post("/login", studentLogin);
router.get("/:id", getStudent);
router.put("/:id", upload.single("profilePhoto"), updateStudent);

export default router;
