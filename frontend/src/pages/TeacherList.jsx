import React, { useEffect, useState } from "react";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/teachers") // Ensure correct API URL
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch((err) => console.error("Error fetching teachers:", err));
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher List</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4">No teachers found.</td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <React.Fragment key={teacher.id}>
                  <tr className="border-b">
                    <td className="p-3 flex items-center">
                      {teacher.profilePhotoUrl ? (
                        <img
                          src={teacher.profilePhotoUrl}
                          alt={teacher.username}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      )}
                      {teacher.username}
                    </td>
                    <td className="p-3">{teacher.email}</td>
                    <td className="p-3">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => handleViewClick(teacher.id)}
                      >
                        {expandedTeacher === teacher.id ? "Hide" : "View"}
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleDelete(teacher.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expandedTeacher === teacher.id && (
                    <tr>
                      <td colSpan="3" className="p-4 bg-gray-100">
                        <p><strong>Phone:</strong> {teacher.phone || "N/A"}</p>
                        <p><strong>Gender:</strong> {teacher.gender || "N/A"}</p>
                        <p><strong>Age:</strong> {teacher.age || "N/A"}</p>
                        <p><strong>Exam Created:</strong> {teacher.hasCreatedExam ? "Yes" : "No"}</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherList;