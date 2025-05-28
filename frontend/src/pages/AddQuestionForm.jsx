// // import { useState } from "react";
// // import axios from "axios";
// // import { motion } from "framer-motion";
// // import Select, { components } from "react-select";

// // const durationOptions = [
// //   { value: 5, label: "5 Minutes" },
// //   { value: 10, label: "10 Minutes" },
// //   { value: 15, label: "15 Minutes" },
// //   { value: 20, label: "20 Minutes" },
// //   { value: 30, label: "30 Minutes" },
// //   { value: 45, label: "45 Minutes" },
// //   { value: 60, label: "60 Minutes" },
// // ];

// // const customStyles = {
// //   control: (provided, state) => ({
// //     ...provided,
// //     minWidth: "120px",
// //     borderColor: state.isFocused ? "#2684FF" : provided.borderColor,
// //     boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : null,
// //     "&:hover": { borderColor: "#2684FF" },
// //   }),
// //   menu: (provided) => ({ ...provided, maxHeight: "150px" }),
// //   menuList: (provided) => ({ ...provided, maxHeight: "150px" }),
// // };

// // const DropdownIndicator = (props) => {
// //   return (
// //     <components.DropdownIndicator {...props}>
// //       <span style={{ fontSize: "0.8rem" }}>▼</span>
// //     </components.DropdownIndicator>
// //   );
// // };

// // const AddQuestion = () => {
// //   const [subject, setSubject] = useState("");
// //   const [examDuration, setExamDuration] = useState(null); // Store selected duration value
// //   const [questions, setQuestions] = useState([
// //     { title: "", description: "", marks: "", testCases: [{ input: "", output: "" }] },
// //   ]);
// //   const [message, setMessage] = useState("");

// //   const handleQuestionChange = (e, qIndex, field, tcIndex, tcField) => {
// //     const newQuestions = [...questions];
// //     if (tcIndex !== undefined && tcField) {
// //       newQuestions[qIndex].testCases[tcIndex][tcField] = e.target.value;
// //     } else if (field === "marks") {
// //       newQuestions[qIndex][field] = e.target.value === "" ? "" : parseInt(e.target.value, 10);
// //     } else {
// //       newQuestions[qIndex][field] = e.target.value;
// //     }
// //     setQuestions(newQuestions);
// //   };

// //   const handleDurationChange = (selectedOption) => {
// //     setExamDuration(selectedOption ? selectedOption.value : null);
// //   };

// //   const addTestCase = (qIndex) => {
// //     const newQuestions = [...questions];
// //     newQuestions[qIndex].testCases.push({ input: "", output: "" });
// //     setQuestions(newQuestions);
// //   };

// //   const removeTestCase = (qIndex, tcIndex) => {
// //     const newQuestions = [...questions];
// //     newQuestions[qIndex].testCases.splice(tcIndex, 1);
// //     setQuestions(newQuestions);
// //   };

// //   const addQuestion = () =>
// //     setQuestions([
// //       ...questions,
// //       { title: "", description: "", marks: "", testCases: [{ input: "", output: "" }] },
// //     ]);

// //   const removeQuestion = (qIndex) => setQuestions(questions.filter((_, i) => i !== qIndex));

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!subject) {
// //       setMessage("Please enter a subject");
// //       return;
// //     }
// //     if (!examDuration || isNaN(examDuration) || examDuration <= 0) {
// //       setMessage("Please select a valid exam duration from the dropdown.");
// //       return;
// //     }
// //     for (let i = 0; i < questions.length; i++) {
// //       if (!questions[i].marks) {
// //         setMessage(`Please select marks for question ${i + 1}`);
// //         return;
// //       }
// //       if (!questions[i].title.trim()) {
// //         setMessage(`Please enter a title for question ${i + 1}`);
// //         return;
// //       }
// //       if (!questions[i].description.trim()) {
// //         setMessage(`Please enter a description for question ${i + 1}`);
// //         return;
// //       }
// //       for (let j = 0; j < questions[i].testCases.length; j++) {
// //         if (!questions[i].testCases[j].input.trim()) {
// //           setMessage(`Please enter input for test case ${j + 1} in question ${i + 1}`);
// //           return;
// //         }
// //         if (!questions[i].testCases[j].output.trim()) {
// //           setMessage(`Please enter output for test case ${j + 1} in question ${i + 1}`);
// //           return;
// //         }
// //       }
// //     }
// //     try {
// //       const teacherId = localStorage.getItem("teacher_id") || localStorage.getItem("user_id") || "60d0fe4f5311236168a109ca";
// //       const questionsWithSubject = questions.map((q) => ({ ...q, subject, teacher: teacherId }));
// //       const payload = { questions: questionsWithSubject, examDuration };
// //       console.log("Sending payload to backend:", payload); // Debug log
// //       const response = await axios.post("http://localhost:5001/api/questions/add", payload);
// //       console.log("Backend response:", response.data); // Debug log
// //       setMessage("Questions added successfully!");
// //       setSubject("");
// //       setExamDuration(null);
// //       setQuestions([{ title: "", description: "", marks: "", testCases: [{ input: "", output: "" }] }]);
// //     } catch (error) {
// //       console.error("Error adding questions:", error.response?.data || error.message);
// //       setMessage(`Failed to add questions: ${error.response?.data?.message || error.message}`);
// //     }
// //   };

// //   return (
// //     <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden">
// //       <motion.div
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 1 }}
// //         transition={{ duration: 0.5 }}
// //         className="flex flex-col h-full p-6 overflow-y-auto"
// //       >
// //         <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
// //           <motion.h2
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.2 }}
// //             className="text-3xl font-bold text-green-400 mb-6 text-center"
// //           >
// //             Add Coding Questions
// //           </motion.h2>
// //           <div className="mb-6">
// //             <label className="block text-white mb-2">Subject</label>
// //             <input
// //               type="text"
// //               value={subject}
// //               onChange={(e) => setSubject(e.target.value)}
// //               required
// //               placeholder="Enter subject"
// //               className="w-full p-3 border rounded mb-4 bg-gray-700 text-white placeholder-gray-400"
// //             />
// //             <label className="block text-white mb-2">Exam Duration</label>
// //             <Select
// //               value={durationOptions.find((opt) => opt.value === examDuration) || null}
// //               onChange={handleDurationChange}
// //               options={durationOptions}
// //               styles={customStyles}
// //               components={{ DropdownIndicator }}
// //               placeholder="Select exam duration"
// //               isSearchable={false}
// //               className="w-full text-black"
// //               required
// //             />
// //           </div>
// //           {questions.map((question, qIndex) => (
// //             <motion.div
// //               key={qIndex}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ delay: qIndex * 0.1 }}
// //               className="mb-6 p-4 border rounded-lg bg-gray-700 text-white"
// //             >
// //               <input
// //                 type="text"
// //                 value={question.title}
// //                 onChange={(e) => handleQuestionChange(e, qIndex, "title")}
// //                 required
// //                 placeholder="Question Title"
// //                 className="w-full p-3 border rounded mb-4 bg-gray-800 text-white placeholder-gray-400"
// //               />
// //               <textarea
// //                 value={question.description}
// //                 onChange={(e) => handleQuestionChange(e, qIndex, "description")}
// //                 required
// //                 placeholder="Description"
// //                 className="w-full p-3 border rounded mb-4 bg-gray-800 text-white placeholder-gray-400"
// //               />
// //               <select
// //                 value={question.marks}
// //                 onChange={(e) => handleQuestionChange(e, qIndex, "marks")}
// //                 className="w-full p-3 border rounded mb-4 bg-gray-800 text-white"
// //               >
// //                 <option value="" disabled className="text-gray-400">
// //                   Select Marks
// //                 </option>
// //                 {[...Array(10)].map((_, i) => (
// //                   <option key={i + 1} value={i + 1} className="text-black">
// //                     {i + 1}
// //                   </option>
// //                 ))}
// //               </select>
// //               <h4 className="font-bold mb-2 text-green-400">Test Cases</h4>
// //               {question.testCases.map((testCase, tcIndex) => (
// //                 <div key={tcIndex} className="mb-2 flex gap-4">
// //                   <input
// //                     type="text"
// //                     placeholder="Input"
// //                     value={testCase.input}
// //                     onChange={(e) => handleQuestionChange(e, qIndex, "testCases", tcIndex, "input")}
// //                     className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
// //                     required
// //                   />
// //                   <input
// //                     type="text"
// //                     placeholder="Output"
// //                     value={testCase.output}
// //                     onChange={(e) => handleQuestionChange(e, qIndex, "testCases", tcIndex, "output")}
// //                     className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
// //                     required
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => removeTestCase(qIndex, tcIndex)}
// //                     className="text-red-500"
// //                   >
// //                     Remove
// //                   </button>
// //                 </div>
// //               ))}
// //               <motion.button
// //                 whileHover={{ scale: 1.05 }}
// //                 whileTap={{ scale: 0.95 }}
// //                 onClick={() => addTestCase(qIndex)}
// //                 className="mt-2 text-blue-400 font-semibold"
// //               >
// //                 + Add Test Case
// //               </motion.button>
// //               {questions.length > 1 && (
// //                 <motion.button
// //                   whileHover={{ scale: 1.05 }}
// //                   whileTap={{ scale: 0.95 }}
// //                   onClick={() => removeQuestion(qIndex)}
// //                   className="text-red-500 mt-4 block"
// //                 >
// //                   Remove Question
// //                 </motion.button>
// //               )}
// //             </motion.div>
// //           ))}
// //           <motion.button
// //             whileHover={{ scale: 1.05 }}
// //             whileTap={{ scale: 0.95 }}
// //             onClick={addQuestion}
// //             className="bg-blue-500 text-white py-2 px-4 rounded mb-4 w-full"
// //           >
// //             + Add Another Question
// //           </motion.button>
// //           <motion.button
// //             whileHover={{ scale: 1.05 }}
// //             whileTap={{ scale: 0.95 }}
// //             type="submit"
// //             onClick={handleSubmit}
// //             className="w-full bg-green-500 text-white py-2 rounded"
// //           >
// //             Submit All Questions
// //           </motion.button>
// //           {message && (
// //             <motion.p
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 1 }}
// //               transition={{ delay: 0.2 }}
// //               className="mt-4 text-center font-bold text-green-400"
// //             >
// //               {message}
// //             </motion.p>
// //           )}
// //         </div>
// //       </motion.div>
// //       <style>{`
// //         .no-spinner::-webkit-inner-spin-button,
// //         .no-spinner::-webkit-outer-spin-button {
// //           -webkit-appearance: none;
// //           margin: 0;
// //         }
// //         .no-spinner {
// //           -moz-appearance: textfield;
// //         }
// //         .overflow-y-auto::-webkit-scrollbar {
// //           width: 0.5rem;
// //         }
// //         .overflow-y-auto::-webkit-scrollbar-track {
// //           background: transparent;
// //         }
// //         .overflow-y-auto::-webkit-scrollbar-thumb {
// //           background: transparent;
// //         }
// //         .overflow-y-auto:hover::-webkit-scrollbar-thumb {
// //           background: #000;
// //           border-radius: 4px;
// //         }
// //         .overflow-y-auto {
// //           scrollbar-width: thin;
// //           scrollbar-color: rgb(35, 54, 124) transparent;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default AddQuestion;




// import { useState } from "react";
// import { motion } from "framer-motion";

// const durationOptions = [
//   { value: 5, label: "5 Minutes" },
//   { value: 10, label: "10 Minutes" },
//   { value: 15, label: "15 Minutes" },
//   { value: 20, label: "20 Minutes" },
//   { value: 30, label: "30 Minutes" },
//   { value: 45, label: "45 Minutes" },
//   { value: 60, label: "60 Minutes" },
//   { value: 90, label: "90 Minutes" },
//   { value: 120, label: "2 Hours" },
// ];

// const difficultyOptions = [
//   { value: "Easy", label: "Easy", color: "#10B981" },
//   { value: "Medium", label: "Medium", color: "#F59E0B" },
//   { value: "Hard", label: "Hard", color: "#EF4444" },
// ];

// // Custom Select Component (since react-select is not available)
// const CustomSelect = ({ value, onChange, options, placeholder, className }) => {
//   const [isOpen, setIsOpen] = useState(false);
  
//   return (
//     <div className={`relative ${className}`}>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
//       >
//         <span>{value ? value.label : placeholder}</span>
//         <span className="text-xs">▼</span>
//       </button>
      
//       {isOpen && (
//         <div className="absolute top-full left-0 right-0 z-10 bg-gray-700 border border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto">
//           {options.map((option) => (
//             <button
//               key={option.value}
//               type="button"
//               onClick={() => {
//                 onChange(option);
//                 setIsOpen(false);
//               }}
//               className="w-full p-3 text-left text-white hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
//             >
//               {option.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const AddQuestion = () => {
//   const [subject, setSubject] = useState("");
//   const [examDuration, setExamDuration] = useState(null);
//   const [questions, setQuestions] = useState([
//     { 
//       title: "", 
//       description: "", 
//       difficulty: "Easy",
//       marks: "", 
//       testCases: [{ input: "", output: "", isHidden: false }],
//       sampleCode: {
//         javascript: "",
//         python: "",
//         java: "",
//         cpp: ""
//       },
//       hints: [""],
//       tags: [""]
//     },
//   ]);
//   const [message, setMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleQuestionChange = (e, qIndex, field, tcIndex, tcField) => {
//     const newQuestions = [...questions];
    
//     if (tcIndex !== undefined && tcField) {
//       if (tcField === "isHidden") {
//         newQuestions[qIndex].testCases[tcIndex][tcField] = e.target.checked;
//       } else {
//         newQuestions[qIndex].testCases[tcIndex][tcField] = e.target.value;
//       }
//     } else if (field === "marks") {
//       newQuestions[qIndex][field] = e.target.value === "" ? "" : parseInt(e.target.value, 10);
//     } else if (field === "difficulty") {
//       newQuestions[qIndex][field] = e.target.value;
//     } else if (field === "sampleCode") {
//       const language = e.target.dataset.language;
//       newQuestions[qIndex].sampleCode[language] = e.target.value;
//     } else if (field === "hints") {
//       const hintIndex = parseInt(e.target.dataset.index);
//       newQuestions[qIndex].hints[hintIndex] = e.target.value;
//     } else if (field === "tags") {
//       const tagIndex = parseInt(e.target.dataset.index);
//       newQuestions[qIndex].tags[tagIndex] = e.target.value;
//     } else {
//       newQuestions[qIndex][field] = e.target.value;
//     }
    
//     setQuestions(newQuestions);
//   };

//   const handleDurationChange = (selectedOption) => {
//     setExamDuration(selectedOption ? selectedOption.value : null);
//   };

//   const addTestCase = (qIndex) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].testCases.push({ input: "", output: "", isHidden: false });
//     setQuestions(newQuestions);
//   };

//   const removeTestCase = (qIndex, tcIndex) => {
//     const newQuestions = [...questions];
//     if (newQuestions[qIndex].testCases.length > 1) {
//       newQuestions[qIndex].testCases.splice(tcIndex, 1);
//       setQuestions(newQuestions);
//     }
//   };

//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       { 
//         title: "", 
//         description: "", 
//         difficulty: "Easy",
//         marks: "", 
//         testCases: [{ input: "", output: "", isHidden: false }],
//         sampleCode: {
//           javascript: "",
//           python: "",
//           java: "",
//           cpp: ""
//         },
//         hints: [""],
//         tags: [""]
//       },
//     ]);
//   };

//   const removeQuestion = (qIndex) => {
//     if (questions.length > 1) {
//       setQuestions(questions.filter((_, i) => i !== qIndex));
//     }
//   };

//   const validateTestCases = (testCases) => {
//     const visibleTestCases = testCases.filter(tc => !tc.isHidden);
//     if (visibleTestCases.length === 0) {
//       return "At least one test case must be visible to students.";
//     }
//     return null;
//   };

//   const handleTestCode = async (qIndex, language) => {
//     const question = questions[qIndex];
//     const code = question.sampleCode[language];
    
//     if (!code.trim()) {
//       setMessage(`Please add sample ${language} code before testing.`);
//       return;
//     }

//     try {
//       // Simulate code testing (replace with actual API call)
//       setMessage(`Testing sample ${language} code...`);
      
//       // Mock test results
//       setTimeout(() => {
//         const mockResults = Math.random() > 0.3 ? "All test cases passed!" : "Some test cases failed.";
//         setMessage(`Sample ${language} code test: ${mockResults}`);
//       }, 1000);

//     } catch (error) {
//       console.error("Error testing sample code:", error);
//       setMessage(`Error testing sample ${language} code: ${error.message}`);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (isSubmitting) return;
    
//     setIsSubmitting(true);
//     setMessage("");

//     // Validation
//     if (!subject.trim()) {
//       setMessage("Please enter a subject");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!examDuration || isNaN(examDuration) || examDuration <= 0) {
//       setMessage("Please select a valid exam duration from the dropdown.");
//       setIsSubmitting(false);
//       return;
//     }

//     for (let i = 0; i < questions.length; i++) {
//       const question = questions[i];
      
//       if (!question.marks) {
//         setMessage(`Please select marks for question ${i + 1}`);
//         setIsSubmitting(false);
//         return;
//       }

//       if (!question.title.trim()) {
//         setMessage(`Please enter a title for question ${i + 1}`);
//         setIsSubmitting(false);
//         return;
//       }

//       if (!question.description.trim()) {
//         setMessage(`Please enter a description for question ${i + 1}`);
//         setIsSubmitting(false);
//         return;
//       }

//       // Validate test cases
//       const testCaseError = validateTestCases(question.testCases);
//       if (testCaseError) {
//         setMessage(`Question ${i + 1}: ${testCaseError}`);
//         setIsSubmitting(false);
//         return;
//       }

//       for (let j = 0; j < question.testCases.length; j++) {
//         const testCase = question.testCases[j];
//         if (!testCase.input.trim()) {
//           setMessage(`Please enter input for test case ${j + 1} in question ${i + 1}`);
//           setIsSubmitting(false);
//           return;
//         }
//         if (!testCase.output.trim()) {
//           setMessage(`Please enter output for test case ${j + 1} in question ${i + 1}`);
//           setIsSubmitting(false);
//           return;
//         }
//       }
//     }

//     try {
//       // Clean up questions data before sending
//       const questionsWithSubject = questions.map((q) => ({
//         title: q.title,
//         description: q.description,
//         difficulty: q.difficulty,
//         subject,
//         marks: q.marks,
//         testCases: q.testCases.map(tc => ({
//           input: tc.input,
//           output: tc.output,
//           isHidden: tc.isHidden || false
//         })),
//         sampleCode: q.sampleCode,
//         hints: q.hints.filter(hint => hint.trim()),
//         tags: q.tags.filter(tag => tag.trim())
//       }));

//       const payload = { questions: questionsWithSubject, examDuration };
//       console.log("Sending payload to backend:", payload);

//       // Simulate API call (replace with actual endpoint)
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       setMessage("Questions added successfully! 🎉");
      
//       // Reset form
//       setSubject("");
//       setExamDuration(null);
//       setQuestions([
//         { 
//           title: "", 
//           description: "", 
//           difficulty: "Easy",
//           marks: "", 
//           testCases: [{ input: "", output: "", isHidden: false }],
//           sampleCode: {
//             javascript: "",
//             python: "",
//             java: "",
//             cpp: ""
//           },
//           hints: [""],
//           tags: [""]
//         }
//       ]);

//     } catch (error) {
//       console.error("Error adding questions:", error);
//       setMessage(`Failed to add questions: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case "Easy": return "text-green-400";
//       case "Medium": return "text-yellow-400";
//       case "Hard": return "text-red-400";
//       default: return "text-gray-400";
//     }
//   };

//   const getTotalMarks = () => {
//     return questions.reduce((total, q) => total + (parseInt(q.marks) || 0), 0);
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-blue-900">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col p-6"
//       >
//         <div className="bg-gray-800 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-gray-700">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-3xl font-bold text-green-400 mb-6 text-center"
//           >
//             Add Coding Questions
//           </motion.h2>

//           {/* Summary Bar */}
//           <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
//             <div className="flex justify-between items-center text-sm">
//               <span className="text-gray-300">
//                 Questions: <span className="text-blue-400 font-semibold">{questions.length}</span>
//               </span>
//               <span className="text-gray-300">
//                 Total Marks: <span className="text-green-400 font-semibold">{getTotalMarks()}</span>
//               </span>
//               <span className="text-gray-300">
//                 Duration: <span className="text-purple-400 font-semibold">
//                   {examDuration ? `${examDuration} min` : 'Not set'}
//                 </span>
//               </span>
//             </div>
//           </div>

//           {/* Subject and Duration */}
//           <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-white mb-2 font-semibold">Subject *</label>
//               <input
//                 type="text"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 required
//                 placeholder="Enter subject (e.g., Data Structures, Algorithms)"
//                 className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-white mb-2 font-semibold">Exam Duration *</label>
//               <CustomSelect
//                 value={durationOptions.find((opt) => opt.value === examDuration) || null}
//                 onChange={handleDurationChange}
//                 options={durationOptions}
//                 placeholder="Select exam duration"
//                 className="w-full"
//               />
//             </div>
//           </div>

//           {/* Questions */}
//           <div className="space-y-6 mb-6">
//             {questions.map((question, qIndex) => (
//               <motion.div
//                 key={qIndex}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: qIndex * 0.1 }}
//                 className="p-6 border-2 border-gray-600 rounded-xl bg-gray-700 text-white shadow-lg"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-xl font-bold text-green-400">Question {qIndex + 1}</h3>
//                   {questions.length > 1 && (
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => removeQuestion(qIndex)}
//                       className="text-red-400 hover:text-red-300 font-semibold px-3 py-1 rounded border border-red-400 hover:border-red-300"
//                     >
//                       ✕ Remove
//                     </motion.button>
//                   )}
//                 </div>

//                 {/* Title, Difficulty, and Marks */}
//                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
//                   <div className="md:col-span-6">
//                     <label className="block text-gray-300 mb-2">Question Title *</label>
//                     <input
//                       type="text"
//                       value={question.title}
//                       onChange={(e) => handleQuestionChange(e, qIndex, "title")}
//                       required
//                       placeholder="e.g., Two Sum, Binary Tree Traversal"
//                       className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div className="md:col-span-3">
//                     <label className="block text-gray-300 mb-2">Marks *</label>
//                     <select
//                       value={question.marks}
//                       onChange={(e) => handleQuestionChange(e, qIndex, "marks")}
//                       className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="" disabled className="text-gray-400">
//                         Select Marks
//                       </option>
//                       {[...Array(10)].map((_, i) => (
//                         <option key={i + 1} value={i + 1} className="text-white">
//                           {i + 1} {i + 1 === 1 ? 'mark' : 'marks'}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div className="mb-4">
//                   <label className="block text-gray-300 mb-2">Problem Description *</label>
//                   <textarea
//                     value={question.description}
//                     onChange={(e) => handleQuestionChange(e, qIndex, "description")}
//                     required
//                     placeholder="Describe the problem clearly with examples and constraints..."
//                     rows="4"
//                     className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 {/* Test Cases */}
//                 <div className="mb-4">
//                   <div className="flex justify-between items-center mb-3">
//                     <h4 className="font-bold text-blue-400">Test Cases *</h4>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => addTestCase(qIndex)}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
//                     >
//                       + Add Test Case
//                     </motion.button>
//                   </div>
//                   {question.testCases.map((testCase, tcIndex) => (
//                     <div key={tcIndex} className="mb-3 p-4 bg-gray-800 rounded-lg border border-gray-600">
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="text-sm text-gray-300">Test Case {tcIndex + 1}</span>
//                         <div className="flex items-center space-x-2">
//                           {question.testCases.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeTestCase(qIndex, tcIndex)}
//                               className="text-red-400 hover:text-red-300 text-sm"
//                             >
//                               Remove
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                         <div>
//                           <label className="block text-xs text-gray-400 mb-1">Input</label>
//                           <textarea
//                             placeholder="Test input"
//                             value={testCase.input}
//                             onChange={(e) => handleQuestionChange(e, qIndex, "testCases", tcIndex, "input")}
//                             className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             rows="2"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-gray-400 mb-1">Expected Output</label>
//                           <textarea
//                             placeholder="Expected output"
//                             value={testCase.output}
//                             onChange={(e) => handleQuestionChange(e, qIndex, "testCases", tcIndex, "output")}
//                             className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             rows="2"
//                             required
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Add Question Button */}
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={addQuestion}
//             className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg mb-4 w-full font-semibold border border-blue-500"
//           >
//             + Add Another Question
//           </motion.button>

//           {/* Submit Button */}
//           <motion.button
//             whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
//             whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
//             type="submit"
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className={`w-full py-3 rounded-lg font-semibold ${
//               isSubmitting
//                 ? "bg-gray-600 cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700"
//             } text-white border ${
//               isSubmitting ? "border-gray-500" : "border-green-500"
//             }`}
//           >
//             {isSubmitting ? "Submitting..." : "Submit All Questions"}
//           </motion.button>

//           {/* Message */}
//           {message && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className={`mt-4 p-3 rounded-lg text-center font-bold ${
//                 message.includes("successfully") 
//                   ? "bg-green-900 border border-green-500 text-green-400" 
//                   : "bg-red-900 border border-red-500 text-red-400"
//               }`}
//             >
//               {message}
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default AddQuestion;


import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Select, { components } from "react-select";

const durationOptions = [
  { value: 5, label: "5 Minutes" },
  { value: 10, label: "10 Minutes" },
  { value: 15, label: "15 Minutes" },
  { value: 20, label: "20 Minutes" },
  { value: 30, label: "30 Minutes" },
  { value: 45, label: "45 Minutes" },
  { value: 60, label: "60 Minutes" },
];

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minWidth: "120px",
    borderColor: state.isFocused ? "#2684FF" : provided.borderColor,
    boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : null,
    "&:hover": { borderColor: "#2684FF" },
  }),
  menu: (provided) => ({ ...provided, maxHeight: "150px" }),
  menuList: (provided) => ({ ...provided, maxHeight: "150px" }),
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <span style={{ fontSize: "0.8rem" }}>▼</span>
    </components.DropdownIndicator>
  );
};

const AddQuestion = () => {
  const [subject, setSubject] = useState("");
  const [examDuration, setExamDuration] = useState(null); // Store selected duration value
  const [questions, setQuestions] = useState([
    { title: "", description: "", marks: "", testCases: [{ input: "", output: "" }] },
  ]);
  const [message, setMessage] = useState("");

  const handleQuestionChange = (e, qIndex, field, tcIndex, tcField) => {
    const newQuestions = [...questions];
    if (tcIndex !== undefined && tcField) {
      newQuestions[qIndex].testCases[tcIndex][tcField] = e.target.value;
    } else if (field === "marks") {
      newQuestions[qIndex][field] = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    } else {
      newQuestions[qIndex][field] = e.target.value;
    }
    setQuestions(newQuestions);
  };

  const handleDurationChange = (selectedOption) => {
    setExamDuration(selectedOption ? selectedOption.value : null);
  };

  const addTestCase = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].testCases.push({ input: "", output: "" });
    setQuestions(newQuestions);
  };

  const removeTestCase = (qIndex, tcIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].testCases.splice(tcIndex, 1);
    setQuestions(newQuestions);
  };

  const addQuestion = () =>
    setQuestions([
      ...questions,
      { title: "", description: "", marks: "", testCases: [{ input: "", output: "" }] },
    ]);

  const removeQuestion = (qIndex) => setQuestions(questions.filter((_, i) => i !== qIndex));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject) {
      setMessage("Please enter a subject");
      return;
    }
    if (!examDuration || isNaN(examDuration) || examDuration <= 0) {
      setMessage("Please select a valid exam duration from the dropdown.");
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].marks) {
        setMessage(`Please select marks for question ${i + 1}`);
        return;
      }
      if (!questions[i].title.trim()) {
        setMessage(`Please enter a title for question ${i + 1}`);
        return;
      }
      if (!questions[i].description.trim()) {
        setMessage(`Please enter a description for question ${i + 1}`);
        return;
      }
      for (let j = 0; j < questions[i].testCases.length; j++) {
        if (!questions[i].testCases[j].input.trim()) {
          setMessage(`Please enter input for test case ${j + 1} in question ${i + 1}`);
          return;
        }
        if (!questions[i].testCases[j].output.trim()) {
          setMessage(`Please enter output for test case ${j + 1} in question ${i + 1}`);
          return;
        }
      }
    }
    try {
      const teacherId = localStorage.getItem("teacher_id") || localStorage.getItem("user_id") || "60d0fe4f5311236168a109ca";
      const questionsWithSubject = questions.map((q) => ({ ...q, subject, teacher: teacherId }));
      const payload = { questions: questionsWithSubject, examDuration };
      console.log("Sending payload to backend:", payload); // Debug log
      const response = await axios.post("http://localhost:5001/api/questions/add", payload);
      console.log("Backend response:", response.data); // Debug log
      setMessage("Questions added successfully!");
      setSubject("");
      setExamDuration(null);
      setQuestions([{ title: "", description: "", marks: "", testCases: [{ input: "", output: "" }] }]);
    } catch (error) {
      console.error("Error adding questions:", error.response?.data || error.message);
      setMessage(`Failed to add questions: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-full p-6 overflow-y-auto"
      >
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-green-400 mb-6 text-center"
          >
            Add Coding Questions
          </motion.h2>
          <div className="mb-6">
            <label className="block text-white mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Enter subject"
              className="w-full p-3 border rounded mb-4 bg-gray-700 text-white placeholder-gray-400"
            />
            <label className="block text-white mb-2">Exam Duration</label>
            <Select
              value={durationOptions.find((opt) => opt.value === examDuration) || null}
              onChange={handleDurationChange}
              options={durationOptions}
              styles={customStyles}
              components={{ DropdownIndicator }}
              placeholder="Select exam duration"
              isSearchable={false}
              className="w-full text-black"
              required
            />
          </div>
          {questions.map((question, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.1 }}
              className="mb-6 p-4 border rounded-lg bg-gray-700 text-white"
            >
              <input
                type="text"
                value={question.title}
                onChange={(e) => handleQuestionChange(e, qIndex, "title")}
                required
                placeholder="Question Title"
                className="w-full p-3 border rounded mb-4 bg-gray-800 text-white placeholder-gray-400"
              />
              <textarea
                value={question.description}
                onChange={(e) => handleQuestionChange(e, qIndex, "description")}
                required
                placeholder="Description"
                className="w-full p-3 border rounded mb-4 bg-gray-800 text-white placeholder-gray-400"
              />
              <select
                value={question.marks}
                onChange={(e) => handleQuestionChange(e, qIndex, "marks")}
                className="w-full p-3 border rounded mb-4 bg-gray-800 text-white"
              >
                <option value="" disabled className="text-gray-400">
                  Select Marks
                </option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1} className="text-black">
                    {i + 1}
                  </option>
                ))}
              </select>
              <h4 className="font-bold mb-2 text-green-400">Test Cases</h4>
              {question.testCases.map((testCase, tcIndex) => (
                <div key={tcIndex} className="mb-2 flex gap-4">
                  <input
                    type="text"
                    placeholder="Input"
                    value={testCase.input}
                    onChange={(e) => handleQuestionChange(e, qIndex, "testCases", tcIndex, "input")}
                    className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Output"
                    value={testCase.output}
                    onChange={(e) => handleQuestionChange(e, qIndex, "testCases", tcIndex, "output")}
                    className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeTestCase(qIndex, tcIndex)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addTestCase(qIndex)}
                className="mt-2 text-blue-400 font-semibold"
              >
                + Add Test Case
              </motion.button>
              {questions.length > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 mt-4 block"
                >
                  Remove Question
                </motion.button>
              )}
            </motion.div>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addQuestion}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-4 w-full"
          >
            + Add Another Question
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Submit All Questions
          </motion.button>
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-center font-bold text-green-400"
            >
              {message}
            </motion.p>
          )}
        </div>
      </motion.div>
      <style>{`
        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
        .overflow-y-auto::-webkit-scrollbar {
          width: 0.5rem;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: transparent;
        }
        .overflow-y-auto:hover::-webkit-scrollbar-thumb {
          background: #000;
          border-radius: 4px;
        }
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgb(35, 54, 124) transparent;
        }
      `}</style>
    </div>
  );
};

export default AddQuestion;