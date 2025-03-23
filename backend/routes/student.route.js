import express from "express";
import { addStudents, 
        studentLogin, 
        getStudent, 
        updateStudent,
        getAllStudents,
        deleteStudent
     } from "../controllers/student.controller.js";
import { upload } from "../multerConfig.js"; // Updated to use memory storage

const router = express.Router();

router.post("/add", addStudents);
router.post("/login", studentLogin);
router.get("/:id", getStudent);
router.put("/:id", upload.single("profilePhoto"), updateStudent);
router.get("/", getAllStudents);
router.delete("/:id", deleteStudent);

export default router;
