import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";

const WriteMcqCoding = () => {
  const { studentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [codes, setCodes] = useState({});
  const [outputs, setOutputs] = useState({});
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(true);
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
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/mcqcoding/mcqcodingquestions");
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Error fetching questions:", err);
        alert("Failed to load questions. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleCodeChange = (questionId, newCode) => {
    setCodes((prev) => ({ ...prev, [questionId]: newCode }));
  };

  const handleLanguageChange = (questionId, newLanguage) => {
    setLanguages((prev) => ({ ...prev, [questionId]: newLanguage }));
  };

  const handleRunCode = async (questionId) => {
    const code = codes[questionId] || "";
    const language = languages[questionId] || "javascript";

    try {
      const res = await axios.post("http://localhost:5001/api/exam/run", { code, language });
      setOutputs((prev) => ({ ...prev, [questionId]: `Success:\n${res.data.output}` }));
    } catch (err) {
      setOutputs((prev) => ({ ...prev, [questionId]: `Error:\n${err.message}` }));
    }
  };

  const handleSubmit = async () => {
    if (window.confirm("Are you sure you want to submit the exam?")) {
      try {
        const submissionPromises = questions.map((question) => {
          if (question.type === "mcq") {
            return axios.post("http://localhost:5001/api/mcqcoding/submit", {
              studentId,
              questionId: question._id,
              selectedOption: answers[question._id] || "",
            });
          } else {
            return axios.post("http://localhost:5001/api/mcqcoding/submit", {
              studentId,
              questionId: question._id,
              code: codes[question._id] || "",
              language: languages[question._id] || "javascript",
            });
          }
        });

        await Promise.all(submissionPromises);
        setExamSubmitted(true);
      } catch (err) {
        console.error("Error submitting exam:", err);
        alert("Failed to submit exam. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="text-gray-200 text-center mt-20 text-xl">Loading questions...</div>;
  }

  if (examSubmitted) {
    return <div className="text-green-400 text-center mt-20 text-2xl font-semibold">Exam submitted! Redirecting...</div>;
  }

  if (questions.length === 0) {
    return <div className="text-gray-300 text-center mt-20 text-xl">No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center py-8">
      <h2 className="text-4xl font-extrabold my-8 tracking-tight text-indigo-300">Write Exam</h2>

      <div className="w-11/12 max-w-4xl bg-gray-800/90 p-8 rounded-xl shadow-2xl flex flex-col border border-gray-700">
        <div className="text-gray-300 mb-4">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>

        {currentQuestion.type === "mcq" ? (
          <>
            <h3 className="text-2xl font-semibold mb-6 text-indigo-200">{currentQuestion.question_text}</h3>
            <div className="flex flex-col space-y-4">
              {["A", "B", "C", "D"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(currentQuestion._id, option)}
                  aria-label={`Select option ${option}: ${currentQuestion.options[option]}`}
                  className={`w-full p-4 rounded-lg text-left text-lg bg-gray-700/50 border border-gray-600 transition-all duration-300 shadow-md hover:bg-gray-600 hover:border-gray-500 
                    ${answers[currentQuestion._id] === option ? "bg-indigo-600 border-indigo-400 text-white" : ""}`}
                >
                  {currentQuestion.options[option]}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-semibold mb-3 text-indigo-200">{currentQuestion.title}</h3>
            <p className="mb-5 text-gray-300 leading-relaxed">{currentQuestion.description}</p>

            {currentQuestion.testCases && currentQuestion.testCases.length > 0 && (
              <div className="bg-gray-700/70 p-5 rounded-lg mb-6 border border-gray-600">
                <h4 className="text-lg font-semibold mb-3 text-indigo-300">Test Cases:</h4>
                <div className="space-y-3">
                  {currentQuestion.testCases.map((testCase, index) => (
                    <div key={index} className="text-gray-300 text-sm">
                      <strong className="text-green-400">Input:</strong> <span>{testCase.input}</span>
                      <br />
                      <strong className="text-yellow-400">Expected Output:</strong> <span>{testCase.output}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="block mb-2 text-lg font-medium text-gray-200">Select Language:</label>
            <select
              className="p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={languages[currentQuestion._id] || "javascript"}
              onChange={(e) => handleLanguageChange(currentQuestion._id, e.target.value)}
            >
              {Object.entries(languageOptions).map(([key, label]) => (
                <option key={key} value={key} className="bg-gray-800">
                  {label}
                </option>
              ))}
            </select>

            <div className="mt-5 flex-grow">
              <Editor
                height="250px"
                language={languages[currentQuestion._id] || "javascript"}
                theme="vs-dark"
                value={codes[currentQuestion._id] || ""}
                onChange={(newCode) => handleCodeChange(currentQuestion._id, newCode)}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
              />
            </div>

            <button
              onClick={() => handleRunCode(currentQuestion._id)}
              className="mt-4 p-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-white font-medium"
            >
              Run Code
            </button>

            {outputs[currentQuestion._id] && (
              <div className="mt-4">
                <pre className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-gray-300 text-sm">
                  {outputs[currentQuestion._id]}
                </pre>
                <button
                  onClick={() => setOutputs((prev) => ({ ...prev, [currentQuestion._id]: "" }))}
                  className="mt-2 p-2 bg-gray-600 rounded-lg hover:bg-gray-700 text-white"
                >
                  Clear Output
                </button>
              </div>
            )}
          </>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
            className="p-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="p-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-white font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="p-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200 text-white font-medium"
            >
              Submit Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteMcqCoding;