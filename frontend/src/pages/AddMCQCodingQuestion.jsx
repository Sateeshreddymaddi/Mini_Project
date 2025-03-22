import { useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Select from "react-select";

// Constants for marks dropdown
const MARKS_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} Mark${i + 1 > 1 ? "s" : ""}`,
}));

// Initial state for a single question
const INITIAL_QUESTION = {
  type: "coding",
  title: "",
  description: "",
  marks: null,
  testCases: [{ input: "", output: "" }],
  text: "",
  options: ["", "", "", ""],
  correctAnswer: "",
};

const AddQuestions = () => {
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([INITIAL_QUESTION]);
  const [message, setMessage] = useState("");

  // Add a new question form
  const addQuestionForm = useCallback(() => {
    setQuestions((prev) => [...prev, { ...INITIAL_QUESTION }]);
  }, []);

  // Remove a specific question form
  const removeQuestionForm = useCallback((index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Update a specific question's fields
  const updateQuestion = useCallback((index, updates) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updates } : q))
    );
  }, []);

  // Handle question type change
  const handleTypeChange = useCallback(
    (index, newType) => {
      updateQuestion(index, {
        type: newType,
        ...(newType === "coding"
          ? { title: "", description: "", testCases: [{ input: "", output: "" }] }
          : { text: "", options: ["", "", "", ""], correctAnswer: "" }),
      });
    },
    [updateQuestion]
  );

  // Handle marks selection
  const handleMarksChange = useCallback(
    (index, selectedOption) => {
      updateQuestion(index, { marks: selectedOption.value });
    },
    [updateQuestion]
  );

  // Coding question field updates
  const handleCodingFieldChange = useCallback(
    (index, field, value) => {
      updateQuestion(index, { [field]: value });
    },
    [updateQuestion]
  );

  // Test case updates for coding questions
  const handleTestCaseChange = useCallback((qIndex, tcIndex, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              testCases: q.testCases.map((tc, j) =>
                j === tcIndex ? { ...tc, [field]: value } : tc
              ),
            }
          : q
      )
    );
  }, []);

  const addTestCase = useCallback((index) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? { ...q, testCases: [...q.testCases, { input: "", output: "" }] }
          : q
      )
    );
  }, []);

  const removeTestCase = useCallback((qIndex, tcIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, testCases: q.testCases.filter((_, j) => j !== tcIndex) }
          : q
      )
    );
  }, []);

  // MCQ option and correct answer updates
  const handleOptionChange = useCallback((qIndex, oIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) => (j === oIndex ? value : opt)),
            }
          : q
      )
    );
  }, []);

  const handleCorrectAnswerChange = useCallback(
    (index, value) => {
      updateQuestion(index, { correctAnswer: value });
    },
    [updateQuestion]
  );

  // Validate all questions before submission
  const validateQuestions = useCallback(() => {
    return questions.every((q) => {
      if (q.type === "coding") {
        return (
          q.title &&
          q.description &&
          q.marks &&
          q.testCases.some((tc) => tc.input && tc.output)
        );
      }
      return (
        q.text &&
        q.marks &&
        q.options.every((opt) => opt) &&
        q.correctAnswer
      );
    });
  }, [questions]);

  // Submit all questions to the unified backend endpoint
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validate subject presence
      if (!subject) {
        setMessage("Please enter a subject.");
        return;
      }

      // Validate all questions
      if (!validateQuestions()) {
        setMessage("Please fill all required fields in all questions.");
        return;
      }

      try {
        // Retrieve teacher ID from localStorage with a fallback
        const teacherId = localStorage.getItem("teacher_id");

        // Format questions based on type for backend compatibility
        const formattedQuestions = questions.map((q) => {
          // Common fields for all questions
          const base = {
            type: q.type,
            marks: q.marks,
            subject: subject,
            teacher: teacherId,
          };

          if (q.type === "coding") {
            return {
              ...base,
              title: q.title,
              description: q.description,
              testCases: q.testCases, // Array of { input, output } objects
            };
          } else {
            // MCQ question
            return {
              ...base,
              question_text: q.text,
              options: {
                A: q.options[0],
                B: q.options[1],
                C: q.options[2],
                D: q.options[3],
              },
              correct_option: q.correctAnswer,
            };
          }
        });

        // Single API call to the unified backend endpoint
        await axios.post("http://localhost:5001/api/mcqcoding/add-mcqcoding", formattedQuestions);

        // Success handling
        setMessage("All questions submitted successfully!");
        setSubject("");
        setQuestions([INITIAL_QUESTION]); // Reset to initial state

      } catch (error) {
        // Error handling
        setMessage("Failed to submit questions.");
        console.error("Submission error:", error); // Optional: for debugging
      }
    },
    [subject, questions, validateQuestions]
  );

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-full p-6 overflow-y-auto gap-8"
      >
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit}>
            <motion.h2 className="text-3xl font-bold text-green-400 mb-6 text-center">
              Add Questions
            </motion.h2>

            <div className="mb-6">
              <label className="block mb-2 text-white">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                required
                className="w-full p-3 border rounded bg-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 p-4 border rounded-lg bg-gray-700 text-white"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-green-400">
                    Question {index + 1}
                  </h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestionForm(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Remove Question
                    </button>
                  )}
                </div>

                {/* Question Type Dropdown */}
                <div className="mb-4">
                  <label className="block mb-2 text-white">Question Type</label>
                  <select
                    value={question.type}
                    onChange={(e) => handleTypeChange(index, e.target.value)}
                    className="w-full p-3 border rounded bg-gray-800 text-white"
                  >
                    <option value="coding">Coding</option>
                    <option value="mcq">MCQ</option>
                  </select>
                </div>

                {question.type === "coding" ? (
                  <>
                    <input
                      type="text"
                      value={question.title}
                      onChange={(e) =>
                        handleCodingFieldChange(index, "title", e.target.value)
                      }
                      placeholder="Question Title"
                      className="w-full p-3 border rounded mb-4 bg-gray-800 text-white placeholder-gray-400"
                    />
                    <textarea
                      value={question.description}
                      onChange={(e) =>
                        handleCodingFieldChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Description"
                      className="w-full p-3 border rounded mb-4 bg-gray-800 text-white placeholder-gray-400"
                    />
                    <Select
                      value={MARKS_OPTIONS.find(
                        (opt) => opt.value === question.marks
                      )}
                      onChange={(selected) => handleMarksChange(index, selected)}
                      options={MARKS_OPTIONS}
                      placeholder="Select Marks"
                      className="mb-4"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "#1f2937",
                          borderColor: "#4b5563",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "white",
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "#1f2937",
                        }),
                        option: (base, { isFocused }) => ({
                          ...base,
                          backgroundColor: isFocused ? "#374151" : "#1f2937",
                          color: "white",
                        }),
                      }}
                    />
                    <h4 className="font-bold mb-2 text-green-400">Test Cases</h4>
                    {question.testCases.map((testCase, tcIndex) => (
                      <div
                        key={tcIndex}
                        className="mb-2 flex gap-4 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Input"
                          value={testCase.input}
                          onChange={(e) =>
                            handleTestCaseChange(
                              index,
                              tcIndex,
                              "input",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Output"
                          value={testCase.output}
                          onChange={(e) =>
                            handleTestCaseChange(
                              index,
                              tcIndex,
                              "output",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
                        />
                        {question.testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(index, tcIndex)}
                            className="text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => addTestCase(index)}
                      className="mt-2 text-blue-400 font-semibold"
                    >
                      + Add Test Case
                    </motion.button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) =>
                        handleCodingFieldChange(index, "text", e.target.value)
                      }
                      placeholder="Question Text"
                      className="w-full p-3 border rounded mb-4 bg-gray-800 text-white placeholder-gray-400"
                    />
                    <Select
                      value={MARKS_OPTIONS.find(
                        (opt) => opt.value === question.marks
                      )}
                      onChange={(selected) => handleMarksChange(index, selected)}
                      options={MARKS_OPTIONS}
                      placeholder="Select Marks"
                      className="mb-4"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "#1f2937",
                          borderColor: "#4b5563",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "white",
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "#1f2937",
                        }),
                        option: (base, { isFocused }) => ({
                          ...base,
                          backgroundColor: isFocused ? "#374151" : "#1f2937",
                          color: "white",
                        }),
                      }}
                    />
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {question.options.map((opt, oIndex) => (
                        <input
                          key={oIndex}
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(index, oIndex, e.target.value)
                          }
                          placeholder={`Option ${String.fromCharCode(
                            65 + oIndex
                          )}`}
                          className="p-3 border rounded bg-gray-800 text-white placeholder-gray-400"
                        />
                      ))}
                    </div>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleCorrectAnswerChange(index, e.target.value)
                      }
                      className="w-full p-3 border rounded bg-gray-800 text-white"
                    >
                      <option value="">Select Correct Answer</option>
                      {question.options.map((opt, oIndex) => (
                        <option key={oIndex} value={opt}>
                          {opt || `Option ${String.fromCharCode(65 + oIndex)}`}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </motion.div>
            ))}

            {/* Add Question Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={addQuestionForm}
              className="bg-blue-500 text-white py-2 px-4 rounded mb-4 w-full"
            >
              + Add Question
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              Submit All Questions
            </motion.button>
          </form>
        </div>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`mt-4 text-center font-bold ${
              message.includes("successfully") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default AddQuestions;