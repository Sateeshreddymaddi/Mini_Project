import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const SubjectDetailedResult = () => {
  const { studentId, subjectName } = useParams();
  const navigate = useNavigate();
  const [detailedResults, setDetailedResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetailedResults = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/mcq/detailed-result/${studentId}/${subjectName}`
        );
        console.log("Detailed results response:", res.data);
        setDetailedResults(res.data.detailedResults);
      } catch (err) {
        console.error("Error fetching detailed results:", err);
        setError("Error fetching detailed results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedResults();
  }, [studentId, subjectName]);

  const totalEarned = detailedResults.reduce((acc, item) => acc + item.marksEarned, 0);
  const totalPossible = detailedResults.reduce((acc, item) => acc + item.totalMarks, 0);

  const renderOptionsBoxes = (options, userAnswer, correctAnswer) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(options).map(([optionKey, optionValue]) => {
          const isUserAnswer = optionValue === userAnswer;
          const isCorrect = optionValue === correctAnswer;
          const bgColor = isUserAnswer
            ? isCorrect
              ? "bg-green-600/20 border-green-500"
              : "bg-red-600/20 border-red-500"
            : "bg-gray-700/50 border-gray-600";
          return (
            <motion.div
              key={optionKey}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-4 border rounded-lg ${bgColor} flex flex-col items-start shadow-md transition-all duration-300 text-gray-200`}
            >
              <span className="font-semibold">{optionKey}:</span>
              <span className="mt-1">{optionValue}</span>
            </motion.div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center text-indigo-400 text-xl font-semibold"
      >
        Loading...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center text-red-400 text-lg font-semibold text-center"
      >
        {error}
      </motion.div>
    );
  }

  if (!detailedResults || detailedResults.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center text-gray-300 text-lg text-center"
      >
        No detailed results found for {subjectName}.
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto flex flex-col p-6 lg:p-8"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 p-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 mb-6 w-fit"
        >
          <ArrowLeft size={20} />
          <span className="text-sm lg:text-base font-medium">Back to Results</span>
        </motion.button>

        {/* Header */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl lg:text-5xl font-extrabold text-center mb-10 text-indigo-400 tracking-tight"
        >
          {subjectName} - Detailed Results
        </motion.h2>

        {/* Questions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {detailedResults.map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-gray-800/90 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl lg:text-2xl font-semibold text-indigo-400 mb-4">
                Q{index + 1}: {item.questionText}
              </h3>

              {/* Options */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-300 mb-3">Options</h4>
                {item.options && typeof item.options === "object" && !Array.isArray(item.options) ? (
                  renderOptionsBoxes(item.options, item.userAnswer, item.correctOption)
                ) : (
                  <p className="text-gray-400">No options available</p>
                )}
              </div>

              {/* Answers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gray-700/70 rounded-lg border border-gray-600 shadow-inner"
                >
                  <h4 className="font-medium text-gray-300 mb-2">Your Answer</h4>
                  <p className="text-gray-200">{item.userAnswer || "Not Answered"}</p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gray-700/70 rounded-lg border border-gray-600 shadow-inner"
                >
                  <h4 className="font-medium text-gray-300 mb-2">Correct Answer</h4>
                  <p className="text-gray-200">{item.correctOption}</p>
                </motion.div>
              </div>

              {/* Result */}
              <div className="mt-4">
                <p
                  className={`text-xl font-semibold ${
                    item.isCorrect ? "text-green-400" : "text-red-400"
                  } mb-2`}
                >
                  {item.isCorrect ? "Correct" : "Incorrect"}
                </p>
                <div className="flex items-center mb-3">
                  <span className="text-gray-300 mr-2">Marks:</span>
                  <span className="text-white font-medium">{item.marksEarned}</span>
                  <span className="mx-1 text-gray-300">/</span>
                  <span className="text-white font-medium">{item.totalMarks}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.marksEarned / item.totalMarks) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-3 rounded-full ${item.isCorrect ? "bg-green-500" : "bg-red-500"}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 p-6 bg-gray-800/90 border border-gray-700 rounded-xl shadow-lg"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-center text-indigo-400 mb-6">
            Exam Summary
          </h3>
          <div className="flex justify-center items-center mb-4">
            <p className="text-xl lg:text-2xl font-semibold text-gray-200">
              Total Marks: {totalEarned} / {totalPossible}
            </p>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(totalEarned / totalPossible) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-indigo-500 h-4 rounded-full"
            />
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

export default SubjectDetailedResult;