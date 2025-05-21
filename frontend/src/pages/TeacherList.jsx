import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Trash2, Search, User, Phone, Calendar, Users, Mail, Award, Filter } from "lucide-react";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5001/api/teachers")
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err);
        setIsLoading(false);
      });
  }, []);

  const handleViewClick = (teacherId) => {
    setExpandedTeacher(expandedTeacher === teacherId ? null : teacherId);
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/teachers/${teacherId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));
          alert("Teacher deleted successfully!");
        } else {
          alert("Failed to delete teacher.");
        }
      } catch (error) {
        console.error("Error deleting teacher:", error);
        alert("An error occurred while deleting.");
      }
    }
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Teacher Management</h1>
            <p className="text-indigo-600 mt-1">Manage your teaching staff efficiently</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex items-center">
            <span className="mr-2">Add New Teacher</span>
            <span className="text-xl">+</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search teachers by name or email..."
              className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
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
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Users size={24} className="mr-2" />
              Teacher Directory
            </h2>
            <div className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
              {filteredTeachers.length} Teachers
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
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center p-16">
              <div className="bg-indigo-100 rounded-full p-5 inline-flex mb-6">
                <Users size={40} className="text-indigo-500" />
              </div>
              <p className="text-xl font-medium text-gray-700">No teachers found</p>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                {searchTerm ? 
                  "No teachers match your search criteria. Try a different search term." : 
                  "Teachers added to the system will appear here. Get started by adding your first teacher."
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
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
                    <th className="px-6 py-4 font-semibold">Teacher</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher, index) => (
                    <React.Fragment key={teacher.id}>
                      <tr className={`hover:bg-indigo-50 transition duration-150 ${
                        expandedTeacher === teacher.id ? "bg-indigo-50" : ""
                      }`}>
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            {teacher.profilePhotoUrl ? (
                              <img
                                src={teacher.profilePhotoUrl}
                                alt={teacher.username}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 text-white rounded-full flex items-center justify-center shadow-md">
                                <User size={20} />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="font-semibold text-gray-800">{teacher.username}</div>
                              <div className="text-sm text-gray-500">
                                {teacher.hasCreatedExam && (
                                  <div className="flex items-center mt-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                    <span className="text-green-600 text-xs">Exam creator</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center text-gray-600">
                            <Mail size={16} className="text-gray-400 mr-2" />
                            {teacher.email}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => handleViewClick(teacher.id)}
                              className={`flex items-center px-3 py-2 rounded-lg transition duration-200 ${
                                expandedTeacher === teacher.id
                                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                  : "text-gray-600 hover:bg-gray-100 border border-transparent"
                              }`}
                              aria-label={expandedTeacher === teacher.id ? "Hide details" : "View details"}
                            >
                              {expandedTeacher === teacher.id ? <EyeOff size={18} /> : <Eye size={18} />}
                              <span className="ml-2 font-medium">{expandedTeacher === teacher.id ? "Hide" : "View"}</span>
                            </button>
                            <button
                              onClick={() => handleDelete(teacher.id)}
                              className="flex items-center px-3 py-2 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition duration-200"
                              aria-label="Delete teacher"
                            >
                              <Trash2 size={18} />
                              <span className="ml-2 font-medium">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedTeacher === teacher.id && (
                        <tr>
                          <td colSpan="3" className="px-6 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-b border-indigo-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="bg-white p-4 rounded-xl shadow-sm flex items-start">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                                  <Phone size={20} />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-blue-600">Phone</span>
                                  <p className="font-semibold text-gray-800 mt-1">{teacher.phone || "Not provided"}</p>
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded-xl shadow-sm flex items-start">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3">
                                  <Users size={20} />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-purple-600">Gender</span>
                                  <p className="font-semibold text-gray-800 mt-1">{teacher.gender || "Not specified"}</p>
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded-xl shadow-sm flex items-start">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                                  <Calendar size={20} />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-indigo-600">Age</span>
                                  <p className="font-semibold text-gray-800 mt-1">{teacher.age || "Not specified"}</p>
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded-xl shadow-sm flex items-start md:col-span-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
                                  <Award size={20} />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-green-600">Exam Status</span>
                                  <p className="font-semibold text-gray-800 mt-1">
                                    {teacher.hasCreatedExam 
                                      ? "This teacher has created at least one exam" 
                                      : "This teacher has not created any exams yet"}
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

          {!isLoading && filteredTeachers.length > 0 && (
            <div className="p-4 border-t flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredTeachers.length}</span> out of <span className="font-medium">{teachers.length}</span> teachers
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition">Previous</button>
                <button className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherList;