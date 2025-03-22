// // admin.routes.js
// import express from 'express';
// import * as adminController from '../controllers/admin.controller.js';

// const router = express.Router();

// // Teacher Routes
// router.get('/teachers', adminController.getAllTeachers);
// router.get('/teachers/:id', adminController.getTeacherById);
// router.put('/teachers/:id', adminController.updateTeacher);
// router.delete('/teachers/:id', adminController.deleteTeacher);

// // Student Routes
// router.get('/students', adminController.getAllStudents);
// router.get('/students/:id', adminController.getStudentById);
// router.put('/students/:id', adminController.updateStudent);
// router.delete('/students/:id', adminController.deleteStudent);

// // Coding Submission Routes
// router.get('/coding-submissions', adminController.getAllCodingSubmissions);
// router.get('/coding-submissions/:id', adminController.getCodingSubmissionById);
// router.put('/coding-submissions/:id', adminController.updateCodingSubmission);
// router.delete('/coding-submissions/:id', adminController.deleteCodingSubmission);

// // MCQ Submission Routes
// router.get('/mcq-submissions', adminController.getAllMcqSubmissions);
// router.get('/mcq-submissions/:id', adminController.getMcqSubmissionById);
// router.put('/mcq-submissions/:id', adminController.updateMcqSubmission);
// router.delete('/mcq-submissions/:id', adminController.deleteMcqSubmission);

// export default router;