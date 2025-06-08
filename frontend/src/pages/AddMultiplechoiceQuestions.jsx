import React, { useState } from "react";
import axios from "axios";
import Select, { components } from "react-select";
import { motion } from "framer-motion";

const marksOptions = [
  { value: 1, label: "1 Mark" },
  { value: 2, label: "2 Marks" },
  { value: 3, label: "3 Marks" },
  { value: 4, label: "4 Marks" },
  { value: 5, label: "5 Marks" },
  { value: 6, label: "6 Marks" },
  { value: 7, label: "7 Marks" },
  { value: 8, label: "8 Marks" },
  { value: 9, label: "9 Marks" },
  { value: 10, label: "10 Marks" },
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

const AddMultichoiceQuestions = () => {
  const [subjectName, setSubjectName] = useState("");
  const [examDuration, setExamDuration] = useState(""); // Add exam duration state
  const [questions, setQuestions] = useState([
    { id: 1, text: "", marks: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  const handleSubjectNameChange = (e) => setSubjectName(e.target.value);
  const handleExamDurationChange = (e) => setExamDuration(e.target.value); // Add handler for exam duration
  
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = value;
    setQuestions(updatedQuestions);
  };
  
  const handleMarksChange = (index, selectedOption) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].marks = selectedOption.value;
    setQuestions(updatedQuestions);
  };
  
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };
  
  const handleCorrectAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctAnswer = value;
    setQuestions(updatedQuestions);
  };
  
  const addQuestion = () =>
    setQuestions([
      ...questions,
      { id: questions.length + 1, text: "", marks: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
    
  const deleteLastQuestion = () => {
    if (questions.length === 1) {
      alert("At least one question is required.");
      return;
    }
    setQuestions(questions.slice(0, -1));
  };
  
  const validateQuestions = () => {
    if (!subjectName.trim()) {
      alert("Please enter the subject name.");
      return false;
    }
    
    // Validate exam duration
    if (!examDuration || isNaN(examDuration) || Number(examDuration) <= 0) {
      alert("Please enter a valid exam duration (positive number in minutes).");
      return false;
    }
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`Please enter the text for question ${i + 1}.`);
        return false;
      }
      if (!q.marks.toString().trim()) {
        alert(`Please select the marks for question ${i + 1}.`);
        return false;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          alert(`Please fill out Option ${j + 1} for question ${i + 1}.`);
          return false;
        }
      }
      if (!q.correctAnswer.trim()) {
        alert(`Please select a correct answer for question ${i + 1}.`);
        return false;
      }
    }
    return true;
  };
  
  const handleSave = async () => {
    if (!validateQuestions()) return;
    
    try {
      const teacherId = localStorage.getItem("teacher_id");
      if (!teacherId) {
        alert("Error: Teacher ID not found. Please log in again.");
        return;
      }
      
      const formattedQuestions = questions.map((q) => ({
        question_text: q.text,
        marks: q.marks,
        options: { A: q.options[0], B: q.options[1], C: q.options[2], D: q.options[3] },
        correct_option: q.correctAnswer,
        created_by: teacherId,
        subjectName: subjectName,
      }));
      
      // Format the request body to match backend expectations
      const requestBody = {
        questions: formattedQuestions,
        examDuration: Number(examDuration)
      };
      
      console.log("Sending Data:", requestBody);
      
      // Use the correct endpoint
      const response = await axios.post("http://localhost:5001/api/mcq/add", requestBody, {
        headers: { "Content-Type": "application/json" },
      });
      
      alert(response.data.message);
      setSubjectName("");
      setExamDuration(""); // Reset exam duration
      setQuestions([{ id: 1, text: "", marks: "", options: ["", "", "", ""], correctAnswer: "" }]);
    } catch (error) {
      console.error("Error response:", error.response);
      alert(`Failed to save questions. Error: ${error.response?.data?.message || error.message}`);
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
            Add Multiple Choice Questions
          </motion.h2>
          
          <div className="mb-6">
            <input
              type="text"
              value={subjectName}
              onChange={handleSubjectNameChange}
              placeholder="Enter subject name for all questions"
              className="w-full p-3 border rounded mb-4 bg-gray-700 text-white placeholder-gray-400"
            />
            
            {/* Add exam duration input */}
            <input
              type="number"
              value={examDuration}
              onChange={handleExamDurationChange}
              placeholder="Enter exam duration (in minutes)"
              min="1"
              className="w-full p-3 border rounded mb-4 bg-gray-700 text-white placeholder-gray-400"
            />
          </div>
          
          {questions.map((q, qIndex) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.1 }}
              className="mb-6 p-4 border rounded-lg bg-gray-700 text-white"
            >
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  placeholder={`Enter question ${qIndex + 1}`}
                  className="flex-1 p-3 border rounded bg-gray-800 text-white placeholder-gray-400"
                />
                <Select
                  value={marksOptions.find((opt) => opt.value === q.marks) || null}
                  onChange={(option) => handleMarksChange(qIndex, option)}
                  options={marksOptions}
                  styles={customStyles}
                  components={{ DropdownIndicator }}
                  placeholder="Marks"
                  isSearchable={false}
                  className="w-28 text-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${oIndex + 1}`}
                    className="p-3 border rounded bg-gray-800 text-white placeholder-gray-400"
                  />
                ))}
              </div>
              <select
                value={q.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                className="mt-4 w-full p-3 border rounded bg-gray-800 text-white"
              >
                <option value="">Select Correct Answer</option>
                {q.options.map((opt, index) => (
                  <option key={index} value={opt} className="text-black">
                    {opt || `Option ${index + 1}`}
                  </option>
                ))}
              </select>
            </motion.div>
          ))}
          
          <div className="flex justify-between space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addQuestion}
              className="bg-green-500 text-white px-5 py-3 rounded hover:bg-green-600 w-full"
            >
              + Add More Questions
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={deleteLastQuestion}
              className="bg-red-500 text-white px-5 py-3 rounded hover:bg-red-600 w-full"
            >
              🗑 Delete Last Question
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600 w-full"
            >
              💾 Submit Questions
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddMultichoiceQuestions;