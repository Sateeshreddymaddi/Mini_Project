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