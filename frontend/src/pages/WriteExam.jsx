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
  const [testResults, setTestResults] = useState({});
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState({});
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
          ? `http://localhost:5001/api/questions/submissions/${studentId}?subjectName=${encodeURIComponent(subjectParam)}`
          : `http://localhost:5001/api/questions/submissions/${studentId}`;
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
    if (historyLoading) return;
    if (examHistory.length > 0) {
      setLoading(false);
      return;
    }
    const fetchQuestionsAndSettings = async () => {
      setLoading(true);
      try {
        const url = subjectParam
          ? `http://localhost:5001/api/questions?subjectName=${encodeURIComponent(subjectParam)}`
          : "http://localhost:5001/api/questions";
        const res = await axios.get(url);
        setQuestions(res.data.questions);

        if (subjectParam) {
          try {
            const settingsRes = await axios.get(
              `http://localhost:5001/api/questions/exam-settings/${encodeURIComponent(subjectParam)}`
            );
            const duration = settingsRes.data.examDuration;
            setTimeLeft(duration * 60);
          } catch (err) {
            console.error("No exam duration set for this subject:", err);
            setOutputs((prev) => ({
              ...prev,
              error: "Exam duration not found. Defaulting to 60 minutes.",
            }));
            setTimeLeft(3600);
          }
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setOutputs((prev) => ({ ...prev, error: "Failed to fetch questions." }));
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionsAndSettings();
  }, [historyLoading, examHistory, subjectParam]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isSubmitted) return;
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1 && !isSubmitted) {
          clearInterval(timerId);
          handleSubmitAll();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isSubmitted]);

  useEffect(() => {
    if (examSubmitted) {
      const timer = setTimeout(() => {
        navigate(`/student/${studentId}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [examSubmitted, navigate, studentId]);

  const formatTime = (seconds) => {
    if (seconds === null) return "Loading...";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleCodeChange = (questionId, newCode) => {
    if (isSubmitted) return;
    setCodes((prev) => ({ ...prev, [questionId]: newCode }));
  };

  const handleLanguageChange = (questionId, newLanguage) => {
    if (isSubmitted) return;
    setLanguages((prev) => ({ ...prev, [questionId]: newLanguage }));
  };

  const handleRunCode = (questionId) => {
    if (isSubmitted) return;
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
        .post("http://localhost:5001/api/questions/exam/run", { code, language })
        .then((res) => {
          setOutputs((prev) => ({ ...prev, [questionId]: res.data.output }));
        })
        .catch((err) => {
          setOutputs((prev) => ({ ...prev, [questionId]: `Error: ${err.message}` }));
        });
    }
  };

  const handleTestCode = async (questionId) => {
    if (isSubmitted) return;
    const code = codes[questionId] || "";
    const language = languages[questionId] || "javascript";

    if (!code.trim()) {
      setOutputs((prev) => ({ ...prev, [questionId]: "Please write some code before testing." }));
      return;
    }

    setTestLoading((prev) => ({ ...prev, [questionId]: true }));
    
    try {
      const response = await axios.post("http://localhost:5001/api/questions/exam/test", {
        code,
        language,
        questionId
      });

      const { testResults: results, summary } = response.data;
      setTestResults((prev) => ({ ...prev, [questionId]: results }));
      
      // Format test results for display
      let resultText = `Test Results: ${summary.passed}/${summary.total} passed (${summary.percentage}%)\n\n`;
      
      results.forEach((result, index) => {
        const status = result.passed ? "✅ PASSED" : "❌ FAILED";
        resultText += `Test Case ${result.testCase}: ${status}\n`;
        resultText += `Input: ${result.input}\n`;
        resultText += `Expected: ${result.expectedOutput}\n`;
        resultText += `Got: ${result.actualOutput}\n`;
        if (result.error) {
          resultText += `Error: ${result.error}\n`;
        }
        resultText += "\n";
      });

      setOutputs((prev) => ({ ...prev, [questionId]: resultText }));
    } catch (error) {
      console.error("Error testing code:", error);
      setOutputs((prev) => ({ 
        ...prev, 
        [questionId]: `Error testing code: ${error.response?.data?.message || error.message}` 
      }));
    } finally {
      setTestLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleSubmitCode = (questionId) => {
    if (isSubmitted) return Promise.resolve();
    const code = codes[questionId] || "";
    const language = languages[questionId] || "javascript";
    
    return axios
      .post("http://localhost:5001/api/questions/exam/submit", { 
        questionId, 
        code, 
        language, 
        studentId 
      })
      .then((res) => {
        const { marks, maxMarks, testResults } = res.data;
        let resultText = `Submitted successfully!\n`;
        resultText += `Score: ${marks}/${maxMarks}\n`;
        
        if (testResults) {
          resultText += `Test Cases: ${testResults.passed}/${testResults.total} passed\n`;
          if (testResults.allPassed) {
            resultText += "🎉 All test cases passed!";
          }
        }
        
        setOutputs((prev) => ({
          ...prev,
          [questionId]: resultText,
        }));
      })
      .catch((err) => {
        console.error(`Error submitting code for question ${questionId}:`, err);
        setOutputs((prev) => ({
          ...prev,
          [questionId]: `Error: ${err.response?.data?.message || err.message}`,
        }));
        throw err;
      });
  };

  const handleSubmitAll = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    try {
      const submissionPromises = questions.map((question) => handleSubmitCode(question._id));
      await Promise.all(submissionPromises);
      setExamSubmitted(true);
    } catch (err) {
      console.error("Error submitting all questions:", err);
      alert("Failed to submit some questions. Please try again.");
      setIsSubmitted(false);
    }
  };

  const handlePrevious = () => {
    if (isSubmitted) return;
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (isSubmitted) return;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const toggleEditorSize = () => {
    if (isSubmitted) return;
    setIsEditorMaximized((prev) => !prev);
  };

  // Get test results summary for sidebar indicators
  const getQuestionStatus = (questionId) => {
    const results = testResults[questionId];
    const hasCode = codes[questionId] && codes[questionId].trim();
    
    if (!hasCode) return 'empty';
    if (!results) return 'coded';
    
    const allPassed = results.every(r => r.passed);
    const somePassed = results.some(r => r.passed);
    
    if (allPassed) return 'passed';
    if (somePassed) return 'partial';
    return 'failed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'empty': return 'bg-gray-700 text-gray-200';
      case 'coded': return 'bg-blue-500 text-white';
      case 'partial': return 'bg-yellow-500 text-white';
      case 'passed': return 'bg-green-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      default: return 'bg-gray-700 text-gray-200';
    }
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
              {sub.testResults && sub.testResults.length > 0 && (
                <div className="mt-2 text-sm">
                  <span className="text-yellow-400">Test Cases:</span> {
                    sub.testResults.filter(r => r.passed).length
                  }/{sub.testResults.length} passed
                </div>
              )}
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
        className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex justify-center items-center text-white text-2xl font-semibold text-green-400"
      >
        Exam submitted successfully. Redirecting to student page...
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex">
      {/* Enhanced Sidebar with Status Indicators */}
      <motion.div
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        className="w-24 bg-gray-800/90 p-4 flex flex-col items-center space-y-3 shadow-lg"
      >
        {questions.map((question, index) => {
          const status = getQuestionStatus(question._id);
          const isActive = index === currentQuestionIndex;
          
          return (
            <motion.button
              key={question._id}
              onClick={() => !isSubmitted && setCurrentQuestionIndex(index)}
              whileHover={{ scale: isSubmitted ? 1 : 1.1 }}
              whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 shadow-md relative ${
                isActive
                  ? "ring-2 ring-indigo-400 " + getStatusColor(status)
                  : getStatusColor(status) + " hover:ring-2 hover:ring-gray-400"
              } ${isSubmitted ? "cursor-not-allowed" : ""}`}
            >
              {index + 1}
              {/* Status indicator dot */}
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-gray-800 ${
                status === 'passed' ? 'bg-green-400' :
                status === 'partial' ? 'bg-yellow-400' :
                status === 'failed' ? 'bg-red-400' :
                status === 'coded' ? 'bg-blue-400' : 'bg-gray-500'
              }`} />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-lg font-semibold mb-6 text-right ${
            timeLeft <= 300 ? "text-red-400" : "text-indigo-400"
          }`}
        >
          Time Left: <span>{formatTime(timeLeft)}</span>
        </motion.div>

        <div className="space-y-6">
          {/* Question Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/80 p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">
              {currentQuestion.title}
              <span className="ml-3 text-sm text-gray-400">
                ({currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'})
              </span>
            </h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{currentQuestion.description}</p>
          </motion.div>

          {/* Test Cases */}
          {currentQuestion.testCases && currentQuestion.testCases.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/80 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-semibold text-indigo-300 mb-3">
                Sample Test Cases:
              </h3>
              <div className="space-y-3">
                {currentQuestion.testCases.slice(0, 2).map((tc, index) => (
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
                {currentQuestion.testCases.length > 2 && (
                  <p className="text-gray-400 text-sm">
                    ... and {currentQuestion.testCases.length - 2} more test cases (hidden)
                  </p>
                )}
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
              disabled={isSubmitted}
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
                  readOnly: isSubmitted,
                }}
              />
            </div>
            <div className="flex flex-col space-y-3">
              <motion.button
                whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
                onClick={() => handleRunCode(currentQuestion._id)}
                disabled={isSubmitted}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ${
                  isSubmitted ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Run Code
              </motion.button>
              <motion.button
                whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
                onClick={() => handleTestCode(currentQuestion._id)}
                disabled={isSubmitted || testLoading[currentQuestion._id]}
                className={`px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 ${
                  isSubmitted || testLoading[currentQuestion._id] ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {testLoading[currentQuestion._id] ? "Testing..." : "Test Code"}
              </motion.button>
              <motion.button
                whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
                onClick={() => handleSubmitCode(currentQuestion._id)}
                disabled={isSubmitted}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 ${
                  isSubmitted ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Submit Code
              </motion.button>
              <motion.button
                whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
                onClick={toggleEditorSize}
                disabled={isSubmitted}
                className={`px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition-all duration-300 ${
                  isSubmitted ? "opacity-50 cursor-not-allowed" : ""
                }`}
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
              <pre className="text-sm text-gray-200 max-h-64 overflow-auto whitespace-pre-wrap">
                {outputs[currentQuestion._id]}
              </pre>
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
              whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || isSubmitted}
              className={`px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ${
                currentQuestionIndex === 0 || isSubmitted ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </motion.button>
            {currentQuestionIndex < questions.length - 1 ? (
              <motion.button
                whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
                onClick={handleNext}
                disabled={isSubmitted}
                className={`px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ${
                  isSubmitted ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
                onClick={handleSubmitAll}
                disabled={isSubmitted}
                className={`px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 ${
                  isSubmitted ? "opacity-50 cursor-not-allowed" : ""
                }`}
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