import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const WriteExam = () => {
  const { studentId } = useParams();
  const [searchParams] = useSearchParams();
  const subjectParam = searchParams.get("subject");
  const navigate = useNavigate();

  const [examHistory, setExamHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [codes, setCodes] = useState({});
  const [outputs, setOutputs] = useState({});
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [examSubmitted, setExamSubmitted] = useState(false);

  const languageOptions = {
    javascript: "JavaScript",
    python: "Python",
    java: "Java",
    cpp: "C++",
    c: "C",
    ruby: "Ruby",
    php: "PHP",
    csharp: "C#",
    go: "Go",
    kotlin: "Kotlin",
    swift: "Swift",
    rust: "Rust",
  };

  useEffect(() => {
    const fetchExamHistory = async () => {
      try {
        const url = subjectParam
          ? `http://localhost:5001/api/submissions/${studentId}?subjectName=${encodeURIComponent(subjectParam)}`
          : `http://localhost:5001/api/submissions/${studentId}`;
        const res = await axios.get(url);
        setExamHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch exam history:", err);
        setHistoryError("Failed to fetch exam history.");
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchExamHistory();
  }, [studentId, subjectParam]);

  useEffect(() => {
    if (!historyLoading && examHistory.length === 0) {
      setLoading(true);
      const url = subjectParam
        ? `http://localhost:5001/api/questions?subjectName=${encodeURIComponent(subjectParam)}`
        : "http://localhost:5001/api/questions";
      axios
        .get(url)
        .then((res) => {
          setQuestions(res.data.questions);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching questions:", err);
          setLoading(false);
        });
    }
  }, [historyLoading, examHistory, subjectParam]);

  useEffect(() => {
    if (timeLeft > 0 && !examSubmitted) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft <= 0) {
      handleSubmitAll();
    }
  }, [timeLeft, examSubmitted]);

  useEffect(() => {
    if (examSubmitted) {
      const timer = setTimeout(() => {
        navigate(`/student/${studentId}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [examSubmitted, navigate, studentId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleCodeChange = (questionId, newCode) => {
    setCodes((prev) => ({ ...prev, [questionId]: newCode }));
  };

  const handleLanguageChange = (questionId, newLanguage) => {
    setLanguages((prev) => ({ ...prev, [questionId]: newLanguage }));
  };

  const handleRunCode = (questionId) => {
    const code = codes[questionId] || "";
    const language = languages[questionId] || "javascript";

    if (language === "javascript") {
      const originalConsoleLog = console.log;
      let capturedOutput = "";
      console.log = (...args) => {
        capturedOutput += args.join(" ") + "\n";
      };
      try {
        eval(code);
        setOutputs((prev) => ({ ...prev, [questionId]: capturedOutput }));
      } catch (error) {
        setOutputs((prev) => ({ ...prev, [questionId]: `Error: ${error.message}` }));
      } finally {
        console.log = originalConsoleLog;
      }
    } else {
      axios
        .post("http://localhost:5001/api/exam/run", { code, language })
        .then((res) => {
          setOutputs((prev) => ({ ...prev, [questionId]: res.data.output }));
        })
        .catch((err) => {
          setOutputs((prev) => ({ ...prev, [questionId]: `Error: ${err.message}` }));
        });
    }
  };

  const handleSubmitCode = (questionId) => {
    const code = codes[questionId] || "";
    const language = languages[questionId] || "javascript";
    return axios
      .post("http://localhost:5001/api/exam/submit", { questionId, code, language, studentId })
      .then((res) => {
        setOutputs((prev) => ({
          ...prev,
          [questionId]: `Marks: ${res.data.marks}\n${res.data.message}`,
        }));
      })
      .catch((err) => {
        console.error(`Error submitting code for question ${questionId}:`, err);
        throw err;
      });
  };

  const handleSubmitAll = async () => {
    try {
      const submissionPromises = questions.map((question) => handleSubmitCode(question._id));
      await Promise.all(submissionPromises);
      setExamSubmitted(true);
    } catch (err) {
      console.error("Error submitting all questions:", err);
      alert("Failed to submit some questions. Please try again.");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const toggleEditorSize = () => {
    setIsEditorMaximized((prev) => !prev);
  };

  if (historyLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center text-gray-200 text-xl font-semibold"
      >
        Loading exam history...
      </motion.div>
    );
  }

  if (examHistory.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 p-8 text-white">
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-extrabold mb-8 text-center text-indigo-400 tracking-tight"
        >
          Exam History
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center text-gray-300 text-lg"
        >
          You have already submitted answers for this exam.
        </motion.p>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {examHistory.map((sub) => (
            <motion.li
              key={sub._id}
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="p-4 bg-gray-800/80 rounded-lg shadow-md text-gray-200"
            >
              <span className="font-semibold text-indigo-300">Question:</span> {sub.question.title} -{" "}
              <span className="font-semibold text-green-400">Marks:</span> {sub.marks}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center text-gray-200 text-xl font-semibold"
      >
        Loading questions...
      </motion.div>
    );
  }

  if (questions.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center text-gray-300 text-lg"
      >
        No questions available.
      </motion.p>
    );
  }

  if (examSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray  from-gray-900 to-indigo-900 flex justify-center items-center text-white text-2xl font-semibold text-green-400"
      >
        Exam submitted. Redirecting to student page...
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        className="w-20 bg-gray-800/90 p-4 flex flex-col items-center space-y-3 shadow-lg"
      >
        {questions.map((question, index) => (
          <motion.button
            key={question._id}
            onClick={() => setCurrentQuestionIndex(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 shadow-md ${
              index === currentQuestionIndex
                ? "bg-indigo-500 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            {index + 1}
          </motion.button>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-200 text-lg font-semibold mb-6 text-right"
        >
          Time Left: <span className="text-indigo-400">{formatTime(timeLeft)}</span>
        </motion.div>

        <div className="space-y-6">
          {/* Question Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/80 p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">{currentQuestion.title}</h2>
            <p className="text-gray-300 leading-relaxed">{currentQuestion.description}</p>
          </motion.div>

          {/* Test Cases */}
          {currentQuestion.testCases && currentQuestion.testCases.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/80 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-semibold text-indigo-300 mb-3">Test Cases:</h3>
              <div className="space-y-3">
                {currentQuestion.testCases.map((tc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-3 bg-gray-700/50 rounded-lg"
                  >
                    <p className="text-gray-200">
                      <strong className="text-green-400">Input:</strong> {tc.input}
                    </p>
                    <p className="text-gray-200">
                      <strong className="text-yellow-400">Expected Output:</strong> {tc.output}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Language Selector */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-3"
          >
            <label className="text-gray-200 font-medium">Language:</label>
            <select
              className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              value={languages[currentQuestion._id] || "javascript"}
              onChange={(e) => handleLanguageChange(currentQuestion._id, e.target.value)}
            >
              {Object.entries(languageOptions).map(([key, label]) => (
                <option key={key} value={key} className="bg-gray-800">
                  {label}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Editor and Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-start space-x-6"
          >
            <div className="flex-1 bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <Editor
                height={isEditorMaximized ? "70vh" : "350px"}
                language={languages[currentQuestion._id] || "javascript"}
                theme="vs-dark"
                value={codes[currentQuestion._id] || ""}
                onChange={(newCode) => handleCodeChange(currentQuestion._id, newCode)}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>
            <div className="flex flex-col space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRunCode(currentQuestion._id)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
              >
                Run Code
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubmitCode(currentQuestion._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
              >
                Submit Code
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleEditorSize}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition-all duration-300"
              >
                {isEditorMaximized ? "Minimize" : "Maximize"}
              </motion.button>
            </div>
          </motion.div>

          {/* Output */}
          {outputs[currentQuestion._id] && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800/80 p-6 rounded-xl shadow-lg"
            >
              <h3 className="font-semibold text-indigo-300 mb-3">Output:</h3>
              <pre className="text-sm text-gray-200 max-h-48 overflow-auto">{outputs[currentQuestion._id]}</pre>
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-between"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Previous
            </motion.button>
            {currentQuestionIndex < questions.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitAll}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
              >
                Submit All
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
        .overflow-y-auto:hover::-webkit-scrollbar-thumb {
          background: #6b7280;
        }
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #6b7280 transparent;
        }
      `}</style>
    </div>
  );
};

export default WriteExam;