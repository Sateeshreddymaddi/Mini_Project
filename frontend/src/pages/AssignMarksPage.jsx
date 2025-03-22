import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const AssignMarksPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [marksUpdates, setMarksUpdates] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/exam/students-with-submissions");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error.response?.data || error.message);
      }
    };
    fetchStudents();
  }, []);

  const fetchSubmissions = async (studentId) => {
    if (!studentId) return;
    try {
      const response = await axios.get(`http://localhost:5001/api/exam/${studentId}/submissions`);
      setSubmissions(response.data);
      setMessage("");
    } catch (error) {
      console.error("Error fetching submissions:", error.response?.data || error.message);
      setMessage("Error fetching submissions");
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);
    if (studentId) {
      fetchSubmissions(studentId);
    } else {
      setSubmissions([]);
    }
  };

  const handleMarksChange = (submissionId, value) => {
    const marks = Number(value);
    const maxMarks =
      submissions.find((sub) => sub._id === submissionId)?.question.marks || 0;

    if (marks > maxMarks) {
      setErrors((prev) => ({
        ...prev,
        [submissionId]: `Marks cannot exceed ${maxMarks}`,
      }));
    } else {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[submissionId];
        return updatedErrors;
      });
    }

    setMarksUpdates((prev) => ({ ...prev, [submissionId]: value }));
  };

  const submitMarks = async () => {
    if (Object.keys(errors).length > 0) {
      setMessage("Please fix errors before submitting.");
      return;
    }

    const marksData = submissions.map((sub) => ({
      submissionId: sub._id,
      marks: Number(marksUpdates[sub._id] || 0),
    }));

    try {
      const response = await axios.put("http://localhost:5001/api/exam/assign-marks", {
        marksData,
      });
      setMessage(response.data.message || "Marks assigned successfully!");

      const updatedSubmissions = response.data.updatedSubmissions;
      const newSubmissions = submissions.map((sub) =>
        updatedSubmissions.find((u) => u._id === sub._id) || sub
      );
      setSubmissions(newSubmissions);
    } catch (error) {
      console.error("Error assigning marks:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Error assigning marks");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-blue-900 p-6 text-white flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex-grow flex flex-col"
      >
        <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Assign Marks for Coding Questions
        </h2>

        {/* Student Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 w-full max-w-md mx-auto"
        >
          <label className="block text-lg font-semibold mb-2 text-gray-200">
            Select Student:
          </label>
          <select
            value={selectedStudentId}
            onChange={handleStudentChange}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          >
            <option value="" className="text-gray-400">
              Select a student
            </option>
            {students.map((student) => (
              <option
                key={student._id}
                value={student._id}
                className="bg-gray-700 hover:bg-gray-600"
              >
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        </motion.div>

        {/* Submissions Cards */}
        {submissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 w-full flex-grow overflow-y-auto"
          >
            {submissions.map((sub) => (
              <motion.div
                key={sub._id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 255, 0, 0.2)" }}
                className="border border-gray-700 bg-gray-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 mx-auto w-full"
              >
                {/* Highlighted Question Title */}
                <h3 className="text-2xl font-bold mb-4 text-green-400 bg-gray-900 p-3 rounded-lg shadow-inner">
                  {sub.question?.title || "N/A"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      <strong>Code:</strong>
                    </p>
                    <pre className="bg-gray-700 p-3 rounded-lg text-sm overflow-auto max-h-40 text-white">
                      {sub.code}
                    </pre>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">
                      <strong>Output:</strong>
                    </p>
                    <pre className="bg-gray-700 p-3 rounded-lg text-sm overflow-auto max-h-40 text-white">
                      {sub.output}
                    </pre>
                  </div>

                  {/* Highlighted Maximum Marks */}
                  <p className="text-sm text-gray-300 bg-gray-900 p-2 rounded-lg shadow-inner font-semibold text-emerald-400">
                    <strong>Maximum Marks:</strong>{" "}
                    {sub.question?.marks ?? "N/A"}
                  </p>

                  {sub.question?.testCases?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold text-emerald-400 mb-2">
                        Test Cases:
                      </h4>
                      {sub.question.testCases.map((tc, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-gray-700 p-3 rounded-lg mb-2 text-white"
                        >
                          <p>
                            <strong>Input:</strong> {tc.input}
                          </p>
                          <p>
                            <strong>Expected Output:</strong> {tc.output}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-200 mb-1">
                      Assign Marks:
                    </label>
                    <input
                      type="number"
                      max={sub.question?.marks}
                      value={marksUpdates[sub._id] || ""}
                      onChange={(e) => handleMarksChange(sub._id, e.target.value)}
                      className={`w-full p-2 rounded-lg bg-gray-700 border ${
                        errors[sub._id] ? "border-red-500" : "border-gray-600"
                      } text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 no-spinner`}
                      placeholder="Enter Marks"
                    />
                    {errors[sub._id] && (
                      <p className="text-red-400 text-xs mt-1">{errors[sub._id]}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#22C55E" }}
              whileTap={{ scale: 0.95 }}
              onClick={submitMarks}
              className="w-full max-w-md mx-auto bg-green-500 text-white py-3 px-6 rounded-lg font-semibold mt-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Submit Marks
            </motion.button>
          </motion.div>
        )}

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 text-center font-bold ${
              message.includes("Error") ? "text-red-400" : "text-green-400"
            }`}
          >
            {message}
          </motion.p>
        )}
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
      `}</style>
    </div>
  );
};

export default AssignMarksPage;