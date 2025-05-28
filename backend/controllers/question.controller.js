// // import Question from "../models/Question.js";
// // import ExamSettings from "../models/ExamSettings.js";
// // import Submission from "../models/submission.js";
// // import Student from "../models/Student.js";
// // import mongoose from "mongoose";
// // import axios from "axios";

// // // Helper function to execute code using Judge0 API
// // const executeCode = async (code, language) => {
// //   const languageIds = {
// //     python: 71,
// //     java: 62,
// //     cpp: 54,
// //     c: 50,
// //     javascript: 63,
// //     ruby: 72,
// //     php: 68,
// //     csharp: 51,
// //     go: 60,
// //     kotlin: 78,
// //     swift: 83,
// //     rust: 73,
// //   };

// //   const languageId = languageIds[language];
// //   if (!languageId) {
// //     throw new Error(`Language ${language} not supported.`);
// //   }

// //   const submissionResponse = await axios.post(
// //     "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
// //     {
// //       source_code: code,
// //       language_id: languageId,
// //     },
// //     {
// //       headers: {
// //         "content-type": "application/json",
// //         "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
// //         "x-rapidapi-key": "5fbb1b6577msh94f77a56281f31cp1c73dejsn06af7aa06c59", // Replace with your own Judge0 key
// //       },
// //     }
// //   );

// //   const token = submissionResponse.data.token;
// //   let result;
// //   const pollForResult = async () => {
// //     const resultResponse = await axios.get(
// //       `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
// //       {
// //         headers: {
// //           "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
// //           "x-rapidapi-key": "5fbb1b6577msh94f77a56281f31cp1c73dejsn06af7aa06c59",
// //         },
// //       }
// //     );
// //     result = resultResponse.data;
// //     if (result.status.id < 3) {
// //       await new Promise((resolve) => setTimeout(resolve, 1000));
// //       return pollForResult();
// //     }
// //     return result;
// //   };

// //   await pollForResult();

// //   if (result.stdout) {
// //     return result.stdout;
// //   } else if (result.compile_output) {
// //     return result.compile_output;
// //   } else if (result.stderr) {
// //     return result.stderr;
// //   } else {
// //     return "No output.";
// //   }
// // };

// // export const addQuestion = async (req, res) => {
// //   try {
// //     const { questions, examDuration } = req.body;
// //     console.log("Received payload:", { questions, examDuration }); // Debug log

// //     if (!Array.isArray(questions) || questions.length === 0) {
// //       return res.status(400).json({ message: "Questions must be an array with at least one question." });
// //     }
// //     if (!examDuration || isNaN(examDuration) || examDuration <= 0) {
// //       console.log("Invalid examDuration:", examDuration); // Debug log
// //       return res.status(400).json({ message: "A valid exam duration (positive number in minutes) is required." });
// //     }
// //     const subject = questions[0].subject;
// //     for (const q of questions) {
// //       if (!q.title || !q.description || !q.subject || !q.teacher || !q.marks || !q.testCases || q.testCases.length === 0) {
// //         return res.status(400).json({ message: "All fields (including test cases) are required for each question." });
// //       }
// //       if (q.subject !== subject) {
// //         return res.status(400).json({ message: "All questions must have the same subject." });
// //       }
// //       if (!mongoose.Types.ObjectId.isValid(q.teacher)) {
// //         return res.status(400).json({ message: "Invalid teacher ID" });
// //       }
// //       if (q.marks < 1 || q.marks > 10) {
// //         return res.status(400).json({ message: "Marks must be between 1 and 10." });
// //       }
// //       for (const tc of q.testCases) {
// //         if (!tc.input || !tc.output) {
// //           return res.status(400).json({ message: "Each test case must have input and output." });
// //         }
// //       }
// //     }
// //     const insertedQuestions = await Question.insertMany(questions);
// //     console.log("Inserting ExamSettings:", { subjectName: subject, examDuration }); // Debug log
// //     const updatedSettings = await ExamSettings.findOneAndUpdate(
// //       { subjectName: subject },
// //       { examDuration },
// //       { upsert: true, new: true }
// //     );
// //     console.log("ExamSettings updated:", updatedSettings); // Debug log
// //     return res.status(201).json({ message: "Questions added successfully", questions: insertedQuestions });
// //   } catch (error) {
// //     console.error("Error adding questions:", error);
// //     res.status(500).json({ message: "Internal Server Error", error: error.message });
// //   }
// // };

// // export const getQuestions = async (req, res) => {
// //   try {
// //     const { subjectName } = req.query;
// //     const query = subjectName ? { subject: subjectName } : {};
// //     const questions = await Question.find(query);
// //     res.status(200).json({ questions });
// //   } catch (error) {
// //     console.error("Error fetching questions:", error);
// //     res.status(500).json({ message: "Internal Server Error", error: error.message });
// //   }
// // };

// // export const getExamSettings = async (req, res) => {
// //   try {
// //     const { subjectName } = req.params;
// //     console.log("Fetching ExamSettings for subject:", subjectName); // Debug log
// //     const settings = await ExamSettings.findOne({ subjectName });
// //     if (!settings) {
// //       console.log("No ExamSettings found for subject:", subjectName); // Debug log
// //       return res.status(404).json({ message: "Exam settings not found for this subject." });
// //     }
// //     console.log("Found ExamSettings:", settings); // Debug log
// //     res.status(200).json({ examDuration: settings.examDuration });
// //   } catch (error) {
// //     console.error("Error fetching exam settings:", error);
// //     res.status(500).json({ message: "Internal Server Error", error: error.message });
// //   }
// // };

// // export const submitExamCode = async (req, res) => {
// //   try {
// //     const { questionId, code, language, studentId } = req.body;
// //     if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(studentId)) {
// //       return res.status(400).json({ message: "Invalid question ID or student ID." });
// //     }
// //     if (!code || !language) {
// //       return res.status(400).json({ message: "Code and language are required." });
// //     }
// //     const question = await Question.findById(questionId);
// //     if (!question) {
// //       return res.status(404).json({ message: "Question not found." });
// //     }
// //     const existingSubmission = await Submission.findOne({ question: questionId, student: studentId });
// //     if (existingSubmission) {
// //       return res.status(400).json({ message: "You have already submitted this question." });
// //     }
// //     const submission = new Submission({
// //       question: questionId,
// //       student: studentId,
// //       code,
// //       language,
// //       marks: 0,
// //     });
// //     await submission.save();
// //     await Student.findByIdAndUpdate(studentId, { $push: { submissions: submission._id } });
// //     res.status(200).json({ message: "Code submitted successfully." });
// //   } catch (error) {
// //     console.error("Error submitting exam code:", error);
// //     res.status(500).json({ message: "Internal Server Error", error: error.message });
// //   }
// // };

// // export const runExamCode = async (req, res) => {
// //   try {
// //     const { code, language } = req.body;
// //     if (!code || !language) {
// //       return res.status(400).json({ message: "Code and language are required." });
// //     }
// //     const output = await executeCode(code, language);
// //     res.status(200).json({ output });
// //   } catch (error) {
// //     console.error("Error running exam code:", error);
// //     res.status(500).json({ message: "Internal Server Error", error: error.message });
// //   }
// // };

// // export const getStudentSubmissions = async (req, res) => {
// //   try {
// //     const { studentId } = req.params;
// //     const { subjectName } = req.query;
// //     if (!mongoose.Types.ObjectId.isValid(studentId)) {
// //       return res.status(400).json({ message: "Invalid student ID." });
// //     }
// //     const query = { student: studentId };
// //     if (subjectName) {
// //       const questions = await Question.find({ subject: subjectName });
// //       const questionIds = questions.map((q) => q._id);
// //       query.question = { $in: questionIds };
// //     }
// //     const submissions = await Submission.find(query).populate("question");
// //     res.status(200).json(submissions);
// //   } catch (error) {
// //     console.error("Error fetching student submissions:", error);
// //     res.status(500).json({ message: "Internal Server Error", error: error.message });
// //   }
// // };

// // export const assignMarks = async (req, res) => {
// //   try {
// //     const { submissionId, marks } = req.body;
// //     if (!mongoose.Types.ObjectId.isValid(submissionId)) {
// //       return res.status(400).json({ message: "Invalid submission ID." });
// //     }
// //     if (isNaN(marks) || marks < 0) {
// //       return res.status(400).json({ message: "Valid marks are required." });
// //     }
// //     const submission = await Submission.findById(submissionId);
// //     if (!submission) {
// //       return res.status(404).json({ message: "Submission not found." });
// //     }
// //     const question = await Question.findById(submission.question);
// //     if (!question) {
// //       return res.status(404).json({ message: "Question not found." });
// //     }
// //     if (marks > question.marks) {
// //       return res.status(400).json({ message: `Marks cannot exceed ${question.marks}.` });
// //     }
// //     submission.marks = marks;
// //     await submission.save();
// //     res.status(200).json({ message: "Marks assigned successfully." });
// //   } catch (error) {
// //     console.error("Error assigning marks:", error);
// //     res.status(500).json({ message: "Internal Server Error", error: error.message });
// //   }
// // };

// // export const getStudentsWithSubmissions = async (req, res) => {
// //   try {
// //     const students = await Student.find({}).populate({
// //       path: "submissions",
// //       populate: { path: "question" },
// //     });
// //     res.status(200).json(students);
// //   } catch (error) {
// //     console.error("Error fetching students with submissions:", error);
// //     res.status(500).json({ message: "Internal Server Error", error: error.message });
// //   }
// // };

// // export const getExamResult = async (req, res) => {
// //   try {
// //     const { studentId } = req.params;
// //     if (!mongoose.Types.ObjectId.isValid(studentId)) {
// //       return res.status(400).json({ message: "Invalid student ID." });
// //     }
// //     const submissions = await Submission.find({ student: studentId }).populate("question");
// //     let totalMarks = 0;
// //     let maxMarks = 0;
// //     const results = submissions.map((submission) => {
// //       totalMarks += submission.marks;
// //       maxMarks += submission.question.marks;
// //       return {
// //         questionTitle: submission.question.title,
// //         marksObtained: submission.marks,
// //         maxMarks: submission.question.marks,
// //       };
// //     });
// //     res.status(200).json({ results, totalMarks, maxMarks });
// //   } catch (error) {
// //     console.error("Error fetching exam result:", error);
// //     res.status(500).json({ message: "Internal Server Error", error: error.message });
// //   }
// // };



// import Question from "../models/Question.js";
// import ExamSettings from "../models/ExamSettings.js";
// import Submission from "../models/submission.js";
// import Student from "../models/Student.js";
// import mongoose from "mongoose";
// import axios from "axios";

// // Helper function to execute code using Judge0 API
// const executeCode = async (code, language, input = "") => {
//   const languageIds = {
//     python: 71,
//     java: 62,
//     cpp: 54,
//     c: 50,
//     javascript: 63,
//     ruby: 72,
//     php: 68,
//     csharp: 51,
//     go: 60,
//     kotlin: 78,
//     swift: 83,
//     rust: 73,
//   };

//   const languageId = languageIds[language];
//   if (!languageId) {
//     throw new Error(`Language ${language} not supported.`);
//   }

//   const submissionResponse = await axios.post(
//     "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
//     {
//       source_code: code,
//       language_id: languageId,
//       stdin: input, // Add input for test cases
//     },
//     {
//       headers: {
//         "content-type": "application/json",
//         "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//         "x-rapidapi-key": "5fbb1b6577msh94f77a56281f31cp1c73dejsn06af7aa06c59", // Replace with your own Judge0 key
//       },
//     }
//   );

//   const token = submissionResponse.data.token;
//   let result;
//   const pollForResult = async () => {
//     const resultResponse = await axios.get(
//       `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
//       {
//         headers: {
//           "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//           "x-rapidapi-key": "5fbb1b6577msh94f77a56281f31cp1c73dejsn06af7aa06c59",
//         },
//       }
//     );
//     result = resultResponse.data;
//     if (result.status.id < 3) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return pollForResult();
//     }
//     return result;
//   };

//   await pollForResult();
//   return result;
// };

// // Helper function to normalize output (remove extra whitespace, newlines)
// const normalizeOutput = (output) => {
//   if (!output) return "";
//   return output.toString().trim().replace(/\s+/g, ' ');
// };

// // Helper function to run test cases against user code
// const runTestCases = async (code, language, testCases) => {
//   const results = [];
//   let passedCount = 0;

//   for (let i = 0; i < testCases.length; i++) {
//     const testCase = testCases[i];
//     try {
//       // For JavaScript, handle locally for better performance
//       if (language === 'javascript') {
//         // Create a safe execution environment
//         const result = await executeJavaScriptWithInput(code, testCase.input);
//         const normalizedOutput = normalizeOutput(result.output);
//         const normalizedExpected = normalizeOutput(testCase.output);
//         const passed = normalizedOutput === normalizedExpected;
        
//         if (passed) passedCount++;
        
//         results.push({
//           testCase: i + 1,
//           input: testCase.input,
//           expectedOutput: testCase.output,
//           actualOutput: result.output,
//           passed,
//           error: result.error
//         });
//       } else {
//         // Use Judge0 for other languages
//         const result = await executeCode(code, language, testCase.input);
        
//         if (result.status.id === 3) { // Accepted
//           const normalizedOutput = normalizeOutput(result.stdout);
//           const normalizedExpected = normalizeOutput(testCase.output);
//           const passed = normalizedOutput === normalizedExpected;
          
//           if (passed) passedCount++;
          
//           results.push({
//             testCase: i + 1,
//             input: testCase.input,
//             expectedOutput: testCase.output,
//             actualOutput: result.stdout || "",
//             passed,
//             error: null
//           });
//         } else {
//           // Handle compilation or runtime errors
//           results.push({
//             testCase: i + 1,
//             input: testCase.input,
//             expectedOutput: testCase.output,
//             actualOutput: "",
//             passed: false,
//             error: result.stderr || result.compile_output || "Runtime error"
//           });
//         }
//       }
//     } catch (error) {
//       results.push({
//         testCase: i + 1,
//         input: testCase.input,
//         expectedOutput: testCase.output,
//         actualOutput: "",
//         passed: false,
//         error: error.message
//       });
//     }
//   }

//   return {
//     results,
//     passedCount,
//     totalCount: testCases.length,
//     allPassed: passedCount === testCases.length
//   };
// };

// // Helper function to execute JavaScript with input
// const executeJavaScriptWithInput = async (code, input) => {
//   return new Promise((resolve) => {
//     try {
//       // Create a mock input system
//       const inputLines = input.trim().split('\n');
//       let inputIndex = 0;
      
//       // Mock readline or input functions
//       const mockReadline = () => {
//         if (inputIndex < inputLines.length) {
//           return inputLines[inputIndex++];
//         }
//         return "";
//       };

//       // Capture console output
//       let capturedOutput = "";
//       const originalConsoleLog = console.log;
//       console.log = (...args) => {
//         capturedOutput += args.join(" ") + "\n";
//       };

//       // Create a safe execution context
//       const safeCode = `
//         // Mock input functions
//         const readline = () => mockReadline();
//         const input = () => mockReadline();
        
//         ${code}
//       `;

//       // Execute the code
//       const func = new Function('mockReadline', safeCode);
//       func(mockReadline);

//       // Restore console.log
//       console.log = originalConsoleLog;

//       resolve({
//         output: capturedOutput.trim(),
//         error: null
//       });
//     } catch (error) {
//       resolve({
//         output: "",
//         error: error.message
//       });
//     }
//   });
// };

// export const addQuestion = async (req, res) => {
//   try {
//     const { questions, examDuration } = req.body;
//     console.log("Received payload:", { questions, examDuration }); // Debug log

//     if (!Array.isArray(questions) || questions.length === 0) {
//       return res.status(400).json({ message: "Questions must be an array with at least one question." });
//     }
//     if (!examDuration || isNaN(examDuration) || examDuration <= 0) {
//       console.log("Invalid examDuration:", examDuration); // Debug log
//       return res.status(400).json({ message: "A valid exam duration (positive number in minutes) is required." });
//     }
//     const subject = questions[0].subject;
//     for (const q of questions) {
//       if (!q.title || !q.description || !q.subject || !q.teacher || !q.marks || !q.testCases || q.testCases.length === 0) {
//         return res.status(400).json({ message: "All fields (including test cases) are required for each question." });
//       }
//       if (q.subject !== subject) {
//         return res.status(400).json({ message: "All questions must have the same subject." });
//       }
//       if (!mongoose.Types.ObjectId.isValid(q.teacher)) {
//         return res.status(400).json({ message: "Invalid teacher ID" });
//       }
//       if (q.marks < 1 || q.marks > 10) {
//         return res.status(400).json({ message: "Marks must be between 1 and 10." });
//       }
//       for (const tc of q.testCases) {
//         if (!tc.input || !tc.output) {
//           return res.status(400).json({ message: "Each test case must have input and output." });
//         }
//       }
//     }
//     const insertedQuestions = await Question.insertMany(questions);
//     console.log("Inserting ExamSettings:", { subjectName: subject, examDuration }); // Debug log
//     const updatedSettings = await ExamSettings.findOneAndUpdate(
//       { subjectName: subject },
//       { examDuration },
//       { upsert: true, new: true }
//     );
//     console.log("ExamSettings updated:", updatedSettings); // Debug log
//     return res.status(201).json({ message: "Questions added successfully", questions: insertedQuestions });
//   } catch (error) {
//     console.error("Error adding questions:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// export const getQuestions = async (req, res) => {
//   try {
//     const { subjectName } = req.query;
//     const query = subjectName ? { subject: subjectName } : {};
//     const questions = await Question.find(query);
//     res.status(200).json({ questions });
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// export const getExamSettings = async (req, res) => {
//   try {
//     const { subjectName } = req.params;
//     console.log("Fetching ExamSettings for subject:", subjectName); // Debug log
//     const settings = await ExamSettings.findOne({ subjectName });
//     if (!settings) {
//       console.log("No ExamSettings found for subject:", subjectName); // Debug log
//       return res.status(404).json({ message: "Exam settings not found for this subject." });
//     }
//     console.log("Found ExamSettings:", settings); // Debug log
//     res.status(200).json({ examDuration: settings.examDuration });
//   } catch (error) {
//     console.error("Error fetching exam settings:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// // New endpoint for running and testing code against test cases
// export const runAndTestCode = async (req, res) => {
//   try {
//     const { code, language, questionId } = req.body;
    
//     if (!code || !language) {
//       return res.status(400).json({ message: "Code and language are required." });
//     }

//     if (!questionId || !mongoose.Types.ObjectId.isValid(questionId)) {
//       return res.status(400).json({ message: "Valid question ID is required." });
//     }

//     // Get the question to access test cases
//     const question = await Question.findById(questionId);
//     if (!question) {
//       return res.status(404).json({ message: "Question not found." });
//     }

//     if (!question.testCases || question.testCases.length === 0) {
//       return res.status(400).json({ message: "No test cases found for this question." });
//     }

//     // Run test cases
//     const testResults = await runTestCases(code, language, question.testCases);
    
//     res.status(200).json({
//       message: "Code tested successfully",
//       testResults: testResults.results,
//       summary: {
//         passed: testResults.passedCount,
//         total: testResults.totalCount,
//         allPassed: testResults.allPassed,
//         percentage: Math.round((testResults.passedCount / testResults.totalCount) * 100)
//       }
//     });
//   } catch (error) {
//     console.error("Error running and testing code:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// export const submitExamCode = async (req, res) => {
//   try {
//     const { questionId, code, language, studentId } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(studentId)) {
//       return res.status(400).json({ message: "Invalid question ID or student ID." });
//     }
//     if (!code || !language) {
//       return res.status(400).json({ message: "Code and language are required." });
//     }
    
//     const question = await Question.findById(questionId);
//     if (!question) {
//       return res.status(404).json({ message: "Question not found." });
//     }
    
//     const existingSubmission = await Submission.findOne({ question: questionId, student: studentId });
//     if (existingSubmission) {
//       return res.status(400).json({ message: "You have already submitted this question." });
//     }

//     // Run test cases to calculate marks automatically
//     let marks = 0;
//     let testResults = null;
    
//     if (question.testCases && question.testCases.length > 0) {
//       testResults = await runTestCases(code, language, question.testCases);
//       // Calculate marks based on passed test cases
//       const percentage = testResults.passedCount / testResults.totalCount;
//       marks = Math.round(percentage * question.marks);
//     }

//     const submission = new Submission({
//       question: questionId,
//       student: studentId,
//       code,
//       language,
//       marks,
//       testResults: testResults ? testResults.results : [],
//       submittedAt: new Date()
//     });
    
//     await submission.save();
//     await Student.findByIdAndUpdate(studentId, { $push: { submissions: submission._id } });
    
//     res.status(200).json({ 
//       message: "Code submitted successfully.",
//       marks,
//       maxMarks: question.marks,
//       testResults: testResults ? {
//         passed: testResults.passedCount,
//         total: testResults.totalCount,
//         allPassed: testResults.allPassed
//       } : null
//     });
//   } catch (error) {
//     console.error("Error submitting exam code:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// export const runExamCode = async (req, res) => {
//   try {
//     const { code, language } = req.body;
//     if (!code || !language) {
//       return res.status(400).json({ message: "Code and language are required." });
//     }
    
//     // Simple code execution without test cases
//     const result = await executeCode(code, language);
    
//     if (result.stdout) {
//       res.status(200).json({ output: result.stdout });
//     } else if (result.compile_output) {
//       res.status(200).json({ output: result.compile_output });
//     } else if (result.stderr) {
//       res.status(200).json({ output: result.stderr });
//     } else {
//       res.status(200).json({ output: "No output." });
//     }
//   } catch (error) {
//     console.error("Error running exam code:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// export const getStudentSubmissions = async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const { subjectName } = req.query;
//     if (!mongoose.Types.ObjectId.isValid(studentId)) {
//       return res.status(400).json({ message: "Invalid student ID." });
//     }
//     const query = { student: studentId };
//     if (subjectName) {
//       const questions = await Question.find({ subject: subjectName });
//       const questionIds = questions.map((q) => q._id);
//       query.question = { $in: questionIds };
//     }
//     const submissions = await Submission.find(query).populate("question");
//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error("Error fetching student submissions:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// export const assignMarks = async (req, res) => {
//   try {
//     const { submissionId, marks } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(submissionId)) {
//       return res.status(400).json({ message: "Invalid submission ID." });
//     }
//     if (isNaN(marks) || marks < 0) {
//       return res.status(400).json({ message: "Valid marks are required." });
//     }
//     const submission = await Submission.findById(submissionId);
//     if (!submission) {
//       return res.status(404).json({ message: "Submission not found." });
//     }
//     const question = await Question.findById(submission.question);
//     if (!question) {
//       return res.status(404).json({ message: "Question not found." });
//     }
//     if (marks > question.marks) {
//       return res.status(400).json({ message: `Marks cannot exceed ${question.marks}.` });
//     }
//     submission.marks = marks;
//     await submission.save();
//     res.status(200).json({ message: "Marks assigned successfully." });
//   } catch (error) {
//     console.error("Error assigning marks:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// export const getStudentsWithSubmissions = async (req, res) => {
//   try {
//     const students = await Student.find({}).populate({
//       path: "submissions",
//       populate: { path: "question" },
//     });
//     res.status(200).json(students);
//   } catch (error) {
//     console.error("Error fetching students with submissions:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// export const getExamResult = async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(studentId)) {
//       return res.status(400).json({ message: "Invalid student ID." });
//     }
//     const submissions = await Submission.find({ student: studentId }).populate("question");
//     let totalMarks = 0;
//     let maxMarks = 0;
//     const results = submissions.map((submission) => {
//       totalMarks += submission.marks;
//       maxMarks += submission.question.marks;
//       return {
//         questionTitle: submission.question.title,
//         marksObtained: submission.marks,
//         maxMarks: submission.question.marks,
//         testResults: submission.testResults || []
//       };
//     });
//     res.status(200).json({ results, totalMarks, maxMarks });
//   } catch (error) {
//     console.error("Error fetching exam result:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };



import Question from "../models/Question.js";
import ExamSettings from "../models/ExamSettings.js";
import Submission from "../models/submission.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";
import axios from "axios";

// Helper function to execute code using Judge0 API
const executeCode = async (code, language) => {
  const languageIds = {
    python: 71,
    java: 62,
    cpp: 54,
    c: 50,
    javascript: 63,
    ruby: 72,
    php: 68,
    csharp: 51,
    go: 60,
    kotlin: 78,
    swift: 83,
    rust: 73,
  };

  const languageId = languageIds[language];
  if (!languageId) {
    throw new Error(`Language ${language} not supported.`);
  }

  const submissionResponse = await axios.post(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
    {
      source_code: code,
      language_id: languageId,
    },
    {
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": "5fbb1b6577msh94f77a56281f31cp1c73dejsn06af7aa06c59", // Replace with your own Judge0 key
      },
    }
  );

  const token = submissionResponse.data.token;
  let result;
  const pollForResult = async () => {
    const resultResponse = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
      {
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": "5fbb1b6577msh94f77a56281f31cp1c73dejsn06af7aa06c59",
        },
      }
    );
    result = resultResponse.data;
    if (result.status.id < 3) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return pollForResult();
    }
    return result;
  };

  await pollForResult();

  if (result.stdout) {
    return result.stdout;
  } else if (result.compile_output) {
    return result.compile_output;
  } else if (result.stderr) {
    return result.stderr;
  } else {
    return "No output.";
  }
};

export const addQuestion = async (req, res) => {
  try {
    const { questions, examDuration } = req.body;
    console.log("Received payload:", { questions, examDuration }); // Debug log

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions must be an array with at least one question." });
    }
    if (!examDuration || isNaN(examDuration) || examDuration <= 0) {
      console.log("Invalid examDuration:", examDuration); // Debug log
      return res.status(400).json({ message: "A valid exam duration (positive number in minutes) is required." });
    }
    const subject = questions[0].subject;
    for (const q of questions) {
      if (!q.title || !q.description || !q.subject || !q.teacher || !q.marks || !q.testCases || q.testCases.length === 0) {
        return res.status(400).json({ message: "All fields (including test cases) are required for each question." });
      }
      if (q.subject !== subject) {
        return res.status(400).json({ message: "All questions must have the same subject." });
      }
      if (!mongoose.Types.ObjectId.isValid(q.teacher)) {
        return res.status(400).json({ message: "Invalid teacher ID" });
      }
      if (q.marks < 1 || q.marks > 10) {
        return res.status(400).json({ message: "Marks must be between 1 and 10." });
      }
      for (const tc of q.testCases) {
        if (!tc.input || !tc.output) {
          return res.status(400).json({ message: "Each test case must have input and output." });
        }
      }
    }
    const insertedQuestions = await Question.insertMany(questions);
    console.log("Inserting ExamSettings:", { subjectName: subject, examDuration }); // Debug log
    const updatedSettings = await ExamSettings.findOneAndUpdate(
      { subjectName: subject },
      { examDuration },
      { upsert: true, new: true }
    );
    console.log("ExamSettings updated:", updatedSettings); // Debug log
    return res.status(201).json({ message: "Questions added successfully", questions: insertedQuestions });
  } catch (error) {
    console.error("Error adding questions:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const { subjectName } = req.query;
    const query = subjectName ? { subject: subjectName } : {};
    const questions = await Question.find(query);
    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getExamSettings = async (req, res) => {
  try {
    const { subjectName } = req.params;
    console.log("Fetching ExamSettings for subject:", subjectName); // Debug log
    const settings = await ExamSettings.findOne({ subjectName });
    if (!settings) {
      console.log("No ExamSettings found for subject:", subjectName); // Debug log
      return res.status(404).json({ message: "Exam settings not found for this subject." });
    }
    console.log("Found ExamSettings:", settings); // Debug log
    res.status(200).json({ examDuration: settings.examDuration });
  } catch (error) {
    console.error("Error fetching exam settings:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const submitExamCode = async (req, res) => {
  try {
    const { questionId, code, language, studentId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid question ID or student ID." });
    }
    if (!code || !language) {
      return res.status(400).json({ message: "Code and language are required." });
    }
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    const existingSubmission = await Submission.findOne({ question: questionId, student: studentId });
    if (existingSubmission) {
      return res.status(400).json({ message: "You have already submitted this question." });
    }
    const submission = new Submission({
      question: questionId,
      student: studentId,
      code,
      language,
      marks: 0,
    });
    await submission.save();
    await Student.findByIdAndUpdate(studentId, { $push: { submissions: submission._id } });
    res.status(200).json({ message: "Code submitted successfully." });
  } catch (error) {
    console.error("Error submitting exam code:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const runExamCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ message: "Code and language are required." });
    }
    const output = await executeCode(code, language);
    res.status(200).json({ output });
  } catch (error) {
    console.error("Error running exam code:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getStudentSubmissions = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectName } = req.query;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }
    const query = { student: studentId };
    if (subjectName) {
      const questions = await Question.find({ subject: subjectName });
      const questionIds = questions.map((q) => q._id);
      query.question = { $in: questionIds };
    }
    const submissions = await Submission.find(query).populate("question");
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching student submissions:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const assignMarks = async (req, res) => {
  try {
    const { submissionId, marks } = req.body;
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ message: "Invalid submission ID." });
    }
    if (isNaN(marks) || marks < 0) {
      return res.status(400).json({ message: "Valid marks are required." });
    }
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }
    const question = await Question.findById(submission.question);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    if (marks > question.marks) {
      return res.status(400).json({ message: `Marks cannot exceed ${question.marks}.` });
    }
    submission.marks = marks;
    await submission.save();
    res.status(200).json({ message: "Marks assigned successfully." });
  } catch (error) {
    console.error("Error assigning marks:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getStudentsWithSubmissions = async (req, res) => {
  try {
    const students = await Student.find({}).populate({
      path: "submissions",
      populate: { path: "question" },
    });
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students with submissions:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getExamResult = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }
    const submissions = await Submission.find({ student: studentId }).populate("question");
    let totalMarks = 0;
    let maxMarks = 0;
    const results = submissions.map((submission) => {
      totalMarks += submission.marks;
      maxMarks += submission.question.marks;
      return {
        questionTitle: submission.question.title,
        marksObtained: submission.marks,
        maxMarks: submission.question.marks,
      };
    });
    res.status(200).json({ results, totalMarks, maxMarks });
  } catch (error) {
    console.error("Error fetching exam result:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const runAndTestCode = async (req, res) => {
  try {
    const { code, language, questionId } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ message: "Code and language are required." });
    }

    if (!questionId || !mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "Valid question ID is required." });
    }

    // Get the question to access test cases
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    if (!question.testCases || question.testCases.length === 0) {
      return res.status(400).json({ message: "No test cases found for this question." });
    }

    // Run test cases
    const testResults = await runTestCases(code, language, question.testCases);
    
    res.status(200).json({
      message: "Code tested successfully",
      testResults: testResults.results,
      summary: {
        passed: testResults.passedCount,
        total: testResults.totalCount,
        allPassed: testResults.allPassed,
        percentage: Math.round((testResults.passedCount / testResults.totalCount) * 100)
      }
    });
  } catch (error) {
    console.error("Error running and testing code:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
