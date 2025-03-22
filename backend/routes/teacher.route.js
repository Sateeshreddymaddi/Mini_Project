import express from "express";
import { addTeacher, teacherLogin, getTeacher, updateTeacher, getAllTeachers, deleteTeacher } from "../controllers/teacher.controller.js";
import { upload } from "../multerConfig.js"; // Updated to use memory storage

const router = express.Router();

router.post("/add", addTeacher);
router.post("/login", teacherLogin);
router.get("/:id", getTeacher);
router.put("/:id", upload.single("profilePhoto"), updateTeacher);
router.get("/", getAllTeachers);
router.delete("/:id", deleteTeacher);

export default router;
