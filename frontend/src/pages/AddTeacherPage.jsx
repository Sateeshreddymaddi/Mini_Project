import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const AddTeacherPage = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([{ username: "", password: "" }]);
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTeachers = [...teachers];
    updatedTeachers[index][name] = value;
    setTeachers(updatedTeachers);
  };

  const addTeacherField = () => {
    setTeachers([...teachers, { username: "", password: "" }]);
  };

  const removeTeacherField = (index) => {
    const updatedTeachers = teachers.filter((_, i) => i !== index);
    setTeachers(updatedTeachers.length ? updatedTeachers : [{ username: "", password: "" }]);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Assuming the first row is headers and mapping to username and password
      const headers = data[0];
      const usernameIndex = headers.indexOf("username");
      const passwordIndex = headers.indexOf("password");

      if (usernameIndex === -1 || passwordIndex === -1) {
        toast.error("Excel file must contain 'username' and 'password' columns!");
        setExcelData([]);
        setFile(null);
        return;
      }

      const parsedData = data.slice(1).map((row) => ({
        username: row[usernameIndex],
        password: row[passwordIndex],
      }));
      setExcelData(parsedData.filter((row) => row.username && row.password)); // Filter out incomplete rows
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleExcelSubmit = async () => {
    if (excelData.length === 0) {
      toast.error("No valid data to import from Excel!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/teachers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teachers: excelData }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Teachers imported successfully!");
        setExcelData([]);
        setFile(null);
      } else {
        toast.error(data.message || "Failed to import teachers.");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyFields = teachers.some((teacher) => !teacher.username || !teacher.password);
    if (hasEmptyFields) {
      toast.error("Please fill in all fields for each teacher!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/teachers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teachers }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Teachers added successfully!");
        setTeachers([{ username: "", password: "" }]);
      } else {
        toast.error(data.message || "Failed to add teachers.");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full max-w-4xl mx-auto flex flex-col p-6 md:p-8 lg:p-10 overflow-y-auto"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/adminDashboard")}
          className="flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 mb-6 w-fit"
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
        >
          Add Teachers
        </motion.h2>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <label className="block text-gray-300 font-medium mb-2">Import from Excel</label>
          <div className="flex gap-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="flex-1 p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExcelSubmit}
              disabled={loading || !file || excelData.length === 0}
              className={`p-3 rounded-lg transition-all duration-300 ${
                loading || !file || excelData.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {loading ? "Importing..." : "Import Teachers"}
            </motion.button>
          </div>
          {excelData.length > 0 && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg text-green-400">Preview Data ({excelData.length} Teachers)</h3>
              <ul className="mt-2 text-gray-300">
                {excelData.map((teacher, index) => (
                  <li key={index}>{`Username: ${teacher.username}, Password: ${teacher.password}`}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 md:p-8 lg:p-10 shadow-lg border border-gray-700 space-y-6"
        >
          {teachers.map((teacher, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <input
                type="text"
                name="username"
                value={teacher.username}
                onChange={(e) => handleChange(index, e)}
                placeholder="Teacher Username"
                className="flex-1 p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                required
              />
              <input
                type="password"
                name="password"
                value={teacher.password}
                onChange={(e) => handleChange(index, e)}
                placeholder="Password"
                className="flex-1 p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                required
              />
              {teachers.length > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeTeacherField(index)}
                  className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                >
                  Remove
                </motion.button>
              )}
            </motion.div>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTeacherField}
            type="button"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Add Another Teacher
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg shadow-md transition-all duration-300 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Adding..." : "Add Teachers"}
          </motion.button>
        </motion.form>
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
        /* Customize scrollbar to hide when not needed */
        .overflow-y-auto::-webkit-scrollbar {
          width: 0.5rem; /* Reduce scrollbar width */
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent; /* Make track transparent */
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: transparent; /* Hide thumb when not hovering */
        }
        .overflow-y-auto:hover::-webkit-scrollbar-thumb {
          background: #000; /* Show thumb on hover with a subtle color */
          border-radius: 4px;
        }
        /* For Firefox */
        .overflow-y-auto {
          scrollbar-width: thin; /* Thin scrollbar */
          scrollbar-color:rgb(35, 54, 124) transparent; /* Thumb color and track color */
        }
      `}</style>
    </div>
  );
};

export default AddTeacherPage;