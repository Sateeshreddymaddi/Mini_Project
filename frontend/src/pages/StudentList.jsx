import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Trash2, Search, User, Phone, Calendar, Users, Mail, BookOpen, Filter, GraduationCap } from "lucide-react";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5001/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setIsLoading(false);
      });
  }, []);

  const handleViewClick = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/students/${studentId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setStudents(students.filter((student) => student.id !== studentId));
          alert("Student deleted successfully!");
        } else {
          alert("Failed to delete student.");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("An error occurred while deleting.");
      }
    }
  };

  const filteredStudents = students.filter(student => 
    student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-teal-900">Student Management</h1>
            <p className="text-teal-600 mt-1">Monitor and manage your student roster</p>
          </div>
          <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex items-center">
            <span className="mr-2">Add New Student</span>
            <span className="text-xl">+</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search students by name or email..."
              className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
            <Filter size={16} className="mr-2" />
            <span>Filters</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center">
              <GraduationCap size={24} className="mr-2" />
              Student Directory
            </h2>
            <div className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
              {filteredStudents.length} Students
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-16">
              <div className="animate-pulse space-y-8 w-full max-w-3xl">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="space-x-2 flex">
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center p-16">
              <div className="bg-teal-100 rounded-full p-5 inline-flex mb-6">
                <GraduationCap size={40} className="text-teal-500" />
              </div>
              <p className="text-xl font-medium text-gray-700">No students found</p>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                {searchTerm ? 
                  "No students match your search criteria. Try a different search term." : 
                  "Students added to the system will appear here. Get started by adding your first student."
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-teal-600 hover:text-teal-800 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b">
                    <th className="px-6 py-4 font-semibold">Student</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <React.Fragment key={student.id}>
                      <tr className={`hover:bg-teal-50 transition duration-150 ${
                        expandedStudent === student.id ? "bg-teal-50" : ""
                      }`}>
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            {student.profilePhotoUrl ? (
                              <img
                                src={student.profilePhotoUrl}
                                alt={student.username}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 text-white rounded-full flex items-center justify-center shadow-md">
                                <User size={20} />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="font-semibold text-gray-800">{student.username}</div>
                              <div className="text-sm text-gray-500">
                                {student.hasCreatedExam && (
                                  <div className="flex items-center mt-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                    <span className="text-green-600 text-xs">Has exam</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center text-gray-600">
                            <Mail size={16} className="text-gray-400 mr-2" />
                            {student.email}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => handleViewClick(student.id)}
                              className={`flex items-center px-3 py-2 rounded-lg transition duration-200 ${
                                expandedStudent === student.id
                                  ? "bg-teal-100 text-teal-700 border border-teal-200"
                                  : "text-gray-600 hover:bg-gray-100 border border-transparent"
                              }`}
                              aria-label={expandedStudent === student.id ? "Hide details" : "View details"}
                            >
                              {expandedStudent === student.id ? <EyeOff size={18} /> : <Eye size={18} />}
                              <span className="ml-2 font-medium">{expandedStudent === student.id ? "Hide" : "View"}</span>
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="flex items-center px-3 py-2 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition duration-200"
                              aria-label="Delete student"
                            >
                              <Trash2 size={18} />
                              <span className="ml-2 font-medium">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedStudent === student.id && (
                        <tr>
                          <td colSpan="3" className="px-6 py-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-t border-b border-teal-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="bg-white p-4 rounded-xl shadow-sm flex items-start">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                                  <Phone size={20} />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-blue-600">Phone</span>
                                  <p className="font-semibold text-gray-800 mt-1">{student.phone || "Not provided"}</p>
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded-xl shadow-sm flex items-start">
                                <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg mr-3">
                                  <Users size={20} />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-cyan-600">Gender</span>
                                  <p className="font-semibold text-gray-800 mt-1">{student.gender || "Not specified"}</p>
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded-xl shadow-sm flex items-start">
                                <div className="p-2 bg-teal-100 text-teal-600 rounded-lg mr-3">
                                  <Calendar size={20} />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-teal-600">Age</span>
                                  <p className="font-semibold text-gray-800 mt-1">{student.age || "Not specified"}</p>
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded-xl shadow-sm flex items-start md:col-span-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
                                  <BookOpen size={20} />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-green-600">Exam Status</span>
                                  <p className="font-semibold text-gray-800 mt-1">
                                    {student.hasCreatedExam 
                                      ? "This student has an active exam" 
                                      : "This student doesn't have any exams yet"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filteredStudents.length > 0 && (
            <div className="p-4 border-t flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredStudents.length}</span> out of <span className="font-medium">{students.length}</span> students
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition">Previous</button>
                <button className="px-4 py-2 bg-teal-600 rounded-lg text-white hover:bg-teal-700 transition">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;