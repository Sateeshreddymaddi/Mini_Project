// // admin.controller.js

// import Teacher from '../models/Teacher.js';
// import Student from '../models/Student.js';
// import Submission from '../models/Submission.js';
// import McqSubmission from '../models/McqSubmission.js';

// // --- Teacher Management ---

// /**
//  * Retrieve all teachers
//  */
// export const getAllTeachers = async (req, res) => {
//   try {
//     const teachers = await Teacher.find();
//     res.status(200).json(teachers);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Retrieve a specific teacher by ID
//  */
// export const getTeacherById = async (req, res) => {
//   try {
//     const teacher = await Teacher.findById(req.params.id);
//     if (!teacher) {
//       return res.status(404).json({ message: 'Teacher not found' });
//     }
//     res.status(200).json(teacher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Update a teacher's information
//  */
// export const updateTeacher = async (req, res) => {
//   try {
//     const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!teacher) {
//       return res.status(404).json({ message: 'Teacher not found' });
//     }
//     res.status(200).json(teacher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Delete a teacher by ID
//  */
// export const deleteTeacher = async (req, res) => {
//   try {
//     const teacher = await Teacher.findByIdAndDelete(req.params.id);
//     if (!teacher) {
//       return res.status(404).json({ message: 'Teacher not found' });
//     }
//     res.status(200).json({ message: 'Teacher deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // --- Student Management ---

// /**
//  * Retrieve all students
//  */
// export const getAllStudents = async (req, res) => {
//   try {
//     const students = await Student.find();
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Retrieve a specific student by ID
//  */
// export const getStudentById = async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }
//     res.status(200).json(student);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Update a student's information
//  */
// export const updateStudent = async (req, res) => {
//   try {
//     const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }
//     res.status(200).json(student);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Delete a student by ID
//  */
// export const deleteStudent = async (req, res) => {
//   try {
//     const student = await Student.findByIdAndDelete(req.params.id);
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }
//     res.status(200).json({ message: 'Student deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // --- Coding Submission Management ---

// /**
//  * Retrieve all coding submissions
//  */
// export const getAllCodingSubmissions = async (req, res) => {
//   try {
//     const submissions = await Submission.find()
//       .populate('student', 'username email') // Populate student details
//       .populate('question'); // Populate question details (assuming Question model exists)
//     res.status(200).json(submissions);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Retrieve a specific coding submission by ID
//  */
// export const getCodingSubmissionById = async (req, res) => {
//   try {
//     const submission = await Submission.findById(req.params.id)
//       .populate('student', 'username email')
//       .populate('question');
//     if (!submission) {
//       return res.status(404).json({ message: 'Submission not found' });
//     }
//     res.status(200).json(submission);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Update a coding submission
//  */
// export const updateCodingSubmission = async (req, res) => {
//   try {
//     const submission = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!submission) {
//       return res.status(404).json({ message: 'Submission not found' });
//     }
//     res.status(200).json(submission);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Delete a coding submission by ID
//  */
// export const deleteCodingSubmission = async (req, res) => {
//   try {
//     const submission = await Submission.findByIdAndDelete(req.params.id);
//     if (!submission) {
//       return res.status(404).json({ message: 'Submission not found' });
//     }
//     res.status(200).json({ message: 'Submission deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // --- MCQ Submission Management ---

// /**
//  * Retrieve all MCQ submissions
//  */
// export const getAllMcqSubmissions = async (req, res) => {
//   try {
//     const submissions = await McqSubmission.find()
//       .populate('user_id', 'username email') // Populate student details
//       .populate('question_id'); // Populate MCQ question details (assuming McqQuestion model exists)
//     res.status(200).json(submissions);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Retrieve a specific MCQ submission by ID
//  */
// export const getMcqSubmissionById = async (req, res) => {
//   try {
//     const submission = await McqSubmission.findById(req.params.id)
//       .populate('user_id', 'username email')
//       .populate('question_id');
//     if (!submission) {
//       return res.status(404).json({ message: 'MCQ Submission not found' });
//     }
//     res.status(200).json(submission);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Update an MCQ submission
//  */
// export const updateMcqSubmission = async (req, res) => {
//   try {
//     const submission = await McqSubmission.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!submission) {
//       return res.status(404).json({ message: 'MCQ Submission not found' });
//     }
//     res.status(200).json(submission);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Delete an MCQ submission by ID
//  */
// export const deleteMcqSubmission = async (req, res) => {
//   try {
//     const submission = await McqSubmission.findByIdAndDelete(req.params.id);
//     if (!submission) {
//       return res.status(404).json({ message: 'MCQ Submission not found' });
//     }
//     res.status(200).json({ message: 'MCQ Submission deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };