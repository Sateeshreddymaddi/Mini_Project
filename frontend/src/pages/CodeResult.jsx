import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const ExamResult = () => {
  const { studentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  const totalObtainedMarks = submissions.reduce(
    (acc, sub) => acc + (sub.marks || 0),
    0
  );
  const totalPossibleMarks = submissions.reduce((acc, sub) => {
    if (sub.question && sub.question.marks) {
      return acc + sub.question.marks;
    }
    return acc;
  }, 0);
  const percentage = (totalObtainedMarks / totalPossibleMarks) * 100 || 0;

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/exam/${studentId}/submissions`)
      .then((res) => {
        setSubmissions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching submissions:", err);
        setError("Failed to fetch exam details.");
        setLoading(false);
      });
  }, [studentId]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate the stroke dash offset for the progress circle
  const radius = 90; // Radius of the circle
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-white w-full h-screen flex items-center justify-center"
      >
        Loading exam results...
      </motion.div>
    );
  if (error)
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center text-red-500 w-full h-screen flex items-center justify-center"
      >
        {error}
      </motion.div>
    );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="w-full max-w-full px-5 py-8">
        <motion.h2
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-6 text-center"
        >
          Exam Results
        </motion.h2>

        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl relative">
            <div className="w-[200px] h-[200px] mx-auto relative">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Red background circle (unfilled portion) */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#FF0000" // Red color for remaining space
                  strokeWidth="20"
                  strokeDasharray={circumference}
                  strokeDashoffset="0"
                  transform="rotate(-90 100 100)"
                />
                {/* Green progress circle (filled portion) */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#00FF00" // Green color for filled portion
                  strokeWidth="20"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 100 100)"
                  style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
                />
                {/* Percentage text */}
                <text
                  x="50%"
                  y="50%"
                  dy=".3em"
                  textAnchor="middle"
                  fill="white"
                  fontSize="40"
                  fontWeight="bold"
                >
                  {percentage.toFixed(1)}%
                </text>
              </svg>
            </div>
            <div className="text-center mt-2">
              <p className="text-lg text-white">
                {totalObtainedMarks} / {totalPossibleMarks}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="w-full space-y-6">
          {submissions.map((sub) => (
            <motion.div
              key={sub._id}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHoveredCard(sub._id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="border p-5 rounded-xl bg-gray-800/80 backdrop-blur-sm shadow-xl mx-0"
            >
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-blue-300">
                    {sub.question?.title || "N/A"}
                  </h3>
                  <p className="text-green-400">
                    Marks: {sub.marks || 0} / {sub.question?.marks || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => toggleExpand(sub._id)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  {expanded[sub._id] ? "Hide" : "Show"}
                </button>
              </div>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: expanded[sub._id] ? "auto" : 0,
                  opacity: expanded[sub._id] ? 1 : 0,
                }}
                className="overflow-hidden"
              >
                <div className="mt-4 border-t border-gray-700 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-blue-300">Code:</p>
                      <pre className="bg-gray-900 p-3 rounded-lg text-sm overflow-auto max-h-60">
                        {sub.code}
                      </pre>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-300">Output:</p>
                      <pre className="bg-gray-900 p-3 rounded-lg text-sm overflow-auto max-h-60">
                        {sub.output}
                      </pre>
                    </div>
                  </div>
                  {sub.question?.testCases?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold text-blue-300">Test Cases:</p>
                      {sub.question.testCases.map((tc, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-gray-700 p-3 rounded-lg mt-2"
                        >
                          <p>Input: {tc.input}</p>
                          <p>Expected: {tc.output}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamResult;