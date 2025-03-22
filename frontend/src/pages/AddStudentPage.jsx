import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const AddStudentPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([{ username: "", password: "" }]);
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedStudents = [...students];
    updatedStudents[index][name] = value;
    setStudents(updatedStudents);
  };

  const addStudentField = () => {
    setStudents([...students, { username: "", password: "" }]);
  };

  const removeStudentField = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents.length ? updatedStudents : [{ username: "", password: "" }]);
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
      setExcelData(parsedData.filter((row) => row.username && row.password));
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
      const response = await fetch("http://localhost:5001/api/students/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: excelData }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Students imported successfully!");
        setExcelData([]);
        setFile(null);
      } else {
        toast.error(data.message || "Failed to import students.");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyFields = students.some((student) => !student.username || !student.password);
    if (hasEmptyFields) {
      toast.error("Please fill in all fields for each student!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/students/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students }), // ✅ Fixed: Now sending `students`
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Students added successfully!");
        setStudents([{ username: "", password: "" }]);
      } else {
        toast.error(data.message || "Failed to add students.");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-y-auto">
      <motion.div className="h-full max-w-4xl mx-auto flex flex-col p-6 md:p-8 lg:p-10 overflow-y-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/adminDashboard")}
          className="flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 mb-6 w-fit"
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>
        <h2 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Add Students
        </h2>

        <div className="mb-6">
          <label className="block text-gray-300 font-medium mb-2">Import from Excel</label>
          <div className="flex gap-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="flex-1 p-3 border rounded-lg bg-gray-700 text-white"
            />
            <button
              onClick={handleExcelSubmit}
              disabled={loading || !file || excelData.length === 0}
              className={`p-3 rounded-lg ${loading || !file || excelData.length === 0 ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
            >
              {loading ? "Importing..." : "Import Students"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800/80 rounded-xl p-6 md:p-8 lg:p-10 shadow-lg space-y-6">
          {students.map((student, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="username"
                value={student.username}
                onChange={(e) => handleChange(index, e)}
                placeholder="Student Username"
                className="flex-1 p-3 border rounded-lg bg-gray-700 text-white"
                required
              />
              <input
                type="password"
                name="password"
                value={student.password}
                onChange={(e) => handleChange(index, e)}
                placeholder="Password"
                className="flex-1 p-3 border rounded-lg bg-gray-700 text-white"
                required
              />
              {students.length > 1 && (
                <button onClick={() => removeStudentField(index)} className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Remove
                </button>
              )}
            </div>
          ))}

          <button onClick={addStudentField} type="button" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Add Another Student
          </button>
          <button type="submit" disabled={loading} className={`w-full py-2 rounded-lg ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
            {loading ? "Adding..." : "Add Students"}
          </button>
        </form>
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
          scrollbar-width: none; /* Thin scrollbar */
          scrollbar-color:rgb(35, 54, 124) transparent; /* Thumb color and track color */
        }
      `}</style>
    </div>
  );
};

export default AddStudentPage;