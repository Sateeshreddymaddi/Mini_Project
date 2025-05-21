import React, { useState, useEffect } from "react";
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
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status
  const [examDuration, setExamDuration] = useState(null); // in minutes
  const [timeRemaining, setTimeRemaining] = useState(null); // in seconds

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
        if (subjectParam) {
          try {
            const settingsRes = await axios.get(`http://localhost:5001/api/mcq/exam-settings/${encodeURIComponent(subjectParam)}`);
            const duration = settingsRes.data.examDuration;
            setExamDuration(duration);
            setTimeRemaining(duration * 60); // convert to seconds
          } catch (err) {
            console.error("No exam duration set for this subject:", err);
            setError("Exam duration not found.");
          }
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError("Failed to fetch questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subjectParam, examHistory, historyLoading]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || isSubmitted) return;
    const timerId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1 && !isSubmitted) {
          clearInterval(timerId);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeRemaining, isSubmitted]);

  const handleAnswer = (questionId, selectedOption) => {
    if (timeRemaining <= 0 || isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handlePrevious = () => {
    if (isSubmitted) return;
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (isSubmitted) return;
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    setSubmitting(true);
    setIsSubmitted(true); // Mark as submitted to prevent further calls
    console.log("Submitted answers:", answers);
    try {
      const submissionPromises = Object.entries(answers).map(
        ([question_id, selected_option]) =>
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
      setIsSubmitted(false); // Reset if submission fails
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
        className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 text-lg font-semibold text-white"
      >
        Loading exam history...
      </motion.div>
    );
  }

  if (examHistory && examHistory.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 p-6 text-white"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
        >
          Exam History
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 text-center text-gray-300"
        >
          You have already taken this exam.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <table className="min-w-full divide-y divide-gray-700 bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  View Result
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {examHistory.map((record) => (
                <motion.tr
                  key={record.examId || record._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {record.subjectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/student/${studentId}/result`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
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
    );
  }

  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 text-lg font-semibold text-white"
      >
        Loading questions...
      </motion.div>
    );
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 text-red-500 text-lg"
      >
        {error}
      </motion.div>
    );
  if (!questions.length)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 text-center text-lg text-gray-300"
      >
        No questions found for {subjectParam || "All Subjects"}.
      </motion.div>
    );

  if (examSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white"
      >
        Exam submitted successfully. Redirecting to the student page...
      </motion.div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex h-full"
      >
        {/* Left Panel - Navigation */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-64 bg-gray-800/80 backdrop-blur-md border-r-2 border-gray-700 p-6 flex flex-col items-center justify-start h-full overflow-y-auto"
        >
          <h2 className="text-xl font-semibold mb-6 text-green-400">Questions</h2>
          <div className="grid grid-cols-4 gap-3">
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: isSubmitted ? 1 : 1.1 }}
                whileTap={{ scale: isSubmitted ? 1 : 0.9 }}
                onClick={() => !isSubmitted && setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 cursor-pointer shadow-md transition-all duration-300 ${
                  answers[q.id]
                    ? "bg-green-500 border-green-500 text-white"
                    : currentQuestion === index
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                } ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {index + 1}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel - Question Display */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 flex items-center justify-center p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-4xl bg-gray-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700"
          >
            {examDuration && (
              <div className="mb-4 text-lg font-semibold text-yellow-400">
                This exam has a time limit of {examDuration} minutes.
              </div>
            )}
            {timeRemaining !== null && (
              <div className={`mb-4 text-lg font-semibold ${timeRemaining <= 300 ? "text-red-500" : "text-green-400"}`}>
                Time Remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
              </div>
            )}
            <h3 className="text-2xl font-bold mb-6 text-green-400">
              Question {currentQuestion + 1} ({subjectParam || "All Subjects"})
            </h3>
            <p className="mb-6 text-gray-300 text-lg">{questions[currentQuestion].text}</p>
            <div className="space-y-4 mb-8">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: isSubmitted ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitted ? 1 : 0.98 }}
                  onClick={() => handleAnswer(questions[currentQuestion].id, option)}
                  disabled={isSubmitted}
                  className={`w-full p-3 text-left rounded-lg border transition-all duration-300 shadow-md ${
                    answers[questions[currentQuestion].id] === option
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  } ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              {currentQuestion > 0 && (
                <motion.button
                  whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
                  onClick={handlePrevious}
                  disabled={isSubmitted}
                  className={`px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ${
                    isSubmitted ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  Previous
                </motion.button>
              )}
              {currentQuestion < questions.length - 1 ? (
                <motion.button
                  whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
                  onClick={handleNext}
                  disabled={isSubmitted}
                  className={`px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ${
                    isSubmitted ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
                  onClick={handleSubmit}
                  disabled={submitting || isSubmitted}
                  className={`px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 ${
                    submitting || isSubmitted ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MultiChoiceQuestions;