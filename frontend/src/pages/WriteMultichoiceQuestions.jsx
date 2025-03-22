import { useState, useEffect } from "react"; // Fixed import statement
import axios from "axios";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MultiChoiceQuestions = () => {
  const { studentId } = useParams();
  const [searchParams] = useSearchParams();
  const subjectParam = searchParams.get("subject");
  const navigate = useNavigate();

  const [examHistory, setExamHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);

  useEffect(() => {
    const fetchExamHistory = async () => {
      try {
        const url = subjectParam
          ? `http://localhost:5001/api/mcq/${studentId}/exam-history?subjectName=${encodeURIComponent(subjectParam)}`
          : `http://localhost:5001/api/mcq/${studentId}/exam-history`;
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
    if (examHistory && examHistory.length > 0) {
      setLoading(false);
      return;
    }
    const fetchQuestions = async () => {
      try {
        const url = subjectParam
          ? `http://localhost:5001/api/mcq/all?subjectName=${encodeURIComponent(subjectParam)}`
          : "http://localhost:5001/api/mcq/all";
        const res = await axios.get(url);
        const fetchedQuestions = res.data.map((q) => ({
          id: q._id,
          text: q.question_text,
          options: [q.options.A, q.options.B, q.options.C, q.options.D],
          correctAnswer: q.correct_option,
          subjectName: q.subjectName,
        }));
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError("Failed to fetch questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subjectParam, examHistory, historyLoading]);

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleSubmit = async () => {
    console.log("Submitted answers:", answers);
    setSubmitting(true);
    try {
      const submissionPromises = Object.entries(answers).map(([question_id, selected_option]) =>
        axios.post(`http://localhost:5001/api/mcq/${studentId}/submit-answers`, {
          question_id,
          selected_option,
        })
      );
      await Promise.all(submissionPromises);
      setExamSubmitted(true);
    } catch (err) {
      console.error("Error submitting answers:", err);
      alert("Failed to submit answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (examSubmitted) {
      const timer = setTimeout(() => {
        navigate(`/student/${studentId}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [examSubmitted, navigate]);

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

  if (examHistory && examHistory.length > 0) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/80 rounded-lg shadow-lg p-8 w-full max-w-5xl"
        >
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center text-white mb-4"
          >
            Exam History
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-400 mb-6"
          >
            You have already taken this exam.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="overflow-x-auto"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {examHistory.map((record) => (
                  <motion.tr
                    key={record.examId || record._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="border-t border-gray-700"
                  >
                    <td className="px-6 py-4 text-gray-200">{record.subjectName}</td>
                    <td className="px-6 py-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/student/${studentId}/result`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md"
                      >
                        View Result
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
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

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center text-red-400 text-lg font-semibold"
      >
        {error}
      </motion.div>
    );
  }

  if (!questions.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center text-gray-300 text-lg"
      >
        No questions found for {subjectParam || "All Subjects"}.
      </motion.div>
    );
  }

  if (examSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center text-green-400 text-xl font-semibold"
      >
        You have submitted the exam. Redirecting to student page...
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex overflow-hidden">
      {/* Left Panel - Navigation */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-72 bg-gray-800/90 p-6 flex flex-col items-center shadow-lg border-r border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-6 text-indigo-400 tracking-tight">Questions</h2>
        <div className="grid grid-cols-5 gap-3 w-full">
          {questions.map((q, index) => (
            <motion.button
              key={q.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 shadow-md ${
                answers[q.id]
                  ? "bg-green-600 text-white border-green-500"
                  : currentQuestion === index
                  ? "bg-indigo-500 text-white border-indigo-400"
                  : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
              }`}
            >
              {index + 1}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Right Panel - Question Display */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-1 p-8 flex items-center justify-center overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-3xl bg-gray-800/90 rounded-xl p-8 shadow-lg border border-gray-700"
        >
          <h3 className="text-2xl font-semibold mb-6 text-indigo-400">
            Question {currentQuestion + 1} ({subjectParam || "All Subjects"})
          </h3>
          <p className="mb-6 text-gray-200 text-lg leading-relaxed">{questions[currentQuestion].text}</p>
          <div className="space-y-4 mb-8">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(questions[currentQuestion].id, option)}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-300 shadow-md text-gray-200 ${
                  answers[questions[currentQuestion].id] === option
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Previous
            </motion.button>
            {currentQuestion < questions.length - 1 ? (
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
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {submitting ? "Submitting..." : "Submit Exam"}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>

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

export default MultiChoiceQuestions;