import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Result = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentName = localStorage.getItem("username") || "Student";

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/mcq/subject-report/${studentId}`);
        setReport(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report:", error);
        setLoading(false);
      }
    };
    fetchReport();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl text-indigo-400 font-semibold"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-indigo-900 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="h-full w-full p-6 lg:p-10 flex flex-col"
      >
        <div className="flex-1 bg-gray-800/90 rounded-xl shadow-2xl p-6 lg:p-8 overflow-y-auto">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/student/${studentId}`)}
            className="flex items-center gap-2 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 mb-6 shadow-md"
          >
            <ArrowLeft size={20} />
            <span className="text-sm lg:text-base font-medium">Back to Dashboard</span>
          </motion.button>

          {/* Header */}
          <h2 className="text-3xl lg:text-4xl font-extrabold text-indigo-400 mb-6 tracking-tight">
            Subject Test Results
          </h2>
          <p className="text-lg lg:text-xl text-gray-200 mb-8">
            Student: <span className="font-semibold text-indigo-400">{studentName}</span>
          </p>

          {/* Results */}
          {report.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-400 text-lg lg:text-xl flex items-center justify-center h-64"
            >
              No results found.
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {report.map((subject, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-gray-700/80 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600"
                >
                  <div className="flex items-center space-x-4">
                    {/* Circular Progress */}
                    <div className="w-20 h-20 lg:w-24 lg:h-24">
                      <CircularProgressbar
                        value={subject.correctAnswerPercentage}
                        text={`${subject.correctAnswerPercentage}%`}
                        styles={buildStyles({
                          textSize: "18px",
                          pathColor: `rgba(99, 102, 241, ${subject.correctAnswerPercentage / 100})`,
                          textColor: "#6366f1",
                          trailColor: "#4b5563",
                          strokeLinecap: "round",
                        })}
                      />
                    </div>

                    {/* Subject Details */}
                    <div className="flex-1">
                      <h3
                        className="text-lg lg:text-xl font-semibold text-gray-200 cursor-pointer hover:text-indigo-400 transition-colors duration-200"
                        onClick={() => navigate(`/test-result/${studentId}/${subject.subjectName}`)}
                      >
                        {subject.subjectName}
                      </h3>
                      <p className="text-gray-400 text-sm lg:text-base">
                        Correct: {subject.correctAnswers} / {subject.totalQuestions}
                      </p>
                      <p className="text-gray-400 text-sm lg:text-base">
                        Marks: {subject.totalEarnedMarks} / {subject.totalPossibleMarks} (
                        {subject.marksPercentage}%)
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
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

export default Result;