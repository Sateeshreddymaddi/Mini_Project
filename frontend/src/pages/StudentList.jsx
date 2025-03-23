// import React, { useEffect, useState } from "react";

// const StudentList = () => {
//   const [students, setStudents] = useState([]);
//   const [expandedStudent, setExpandedStudent] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:5001/api/students") // Ensure correct API URL
//       .then((res) => res.json())
//       .then((data) => setTeachers(data))
//       .catch((err) => console.error("Error fetching students:", err));
//   }, []);

//   const handleViewClick = (studentId) => {
//     setExpandedTeacher(expandedStudent === studentId ? null : studentId);
//   };

//   const handleDelete = async (studentId) => {
//     if (window.confirm("Are you sure you want to delete this Student?")) {
//       try {
//         const response = await fetch(`http://localhost:5001/api/students/${studentId}`, {
//           method: "DELETE",
//         });

//         if (response.ok) {
//           setStudents(students.filter((student) => student.id !== studentId));
//           alert("Student deleted successfully!");
//         } else {
//           alert("Failed to delete teacher.");
//         }
//       } catch (error) {
//         console.error("Error deleting Students:", error);
//         alert("An error occurred while deleting.");
//       }
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Student List</h1>

//       <div className="bg-white shadow-md rounded-lg p-4">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Email</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length === 0 ? (
//               <tr>
//                 <td colSpan="3" className="text-center p-4">No Student found.</td>
//               </tr>
//             ) : (
//                 students.map((student) => (
//                 <React.Fragment key={teacher.id}>
//                   <tr className="border-b">
//                     <td className="p-3 flex items-center">
//                       {student.profilePhotoUrl ? (
//                         <img
//                           src={student.profilePhotoUrl}
//                           alt={student.username}
//                           className="w-10 h-10 rounded-full mr-3"
//                         />
//                       ) : (
//                         <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
//                       )}
//                       {teacher.username}
//                     </td>
//                     <td className="p-3">{student.email}</td>
//                     <td className="p-3">
//                       <button
//                         className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//                         onClick={() => handleViewClick(student.id)}
//                       >
//                         {expandedTeacher === student.id ? "Hide" : "View"}
//                       </button>
//                       <button
//                         className="bg-red-500 text-white px-4 py-2 rounded"
//                         onClick={() => handleDelete(student.id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>

//                   {expandedStudent === student.id && (
//                     <tr>
//                       <td colSpan="3" className="p-4 bg-gray-100">
//                         <p><strong>Phone:</strong> {student.phone || "N/A"}</p>
//                         <p><strong>Gender:</strong> {student.gender || "N/A"}</p>
//                         <p><strong>Age:</strong> {student.age || "N/A"}</p>
//                         <p><strong>Exam Created:</strong> {student.hasCreatedExam ? "Yes" : "No"}</p>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StudentList;






import React, { useEffect, useState } from "react";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/students") // Ensure correct API URL
      .then((res) => res.json())
      .then((data) => setStudents(data)) // Fixed: Use setStudents instead of setTeachers
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  const handleViewClick = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId); // Fixed: Use setExpandedStudent
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this Student?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/students/${studentId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setStudents(students.filter((student) => student.id !== studentId));
          alert("Student deleted successfully!");
        } else {
          alert("Failed to delete student."); // Fixed: Corrected message
        }
      } catch (error) {
        console.error("Error deleting Students:", error);
        alert("An error occurred while deleting.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>

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
            {students.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4">No Student found.</td>
              </tr>
            ) : (
              students.map((student) => (
                <React.Fragment key={student.id}> {/* Fixed: Use student.id */}
                  <tr className="border-b">
                    <td className="p-3 flex items-center">
                      {student.profilePhotoUrl ? (
                        <img
                          src={student.profilePhotoUrl}
                          alt={student.username}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      )}
                      {student.username} {/* Fixed: Use student.username */}
                    </td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => handleViewClick(student.id)}
                      >
                        {expandedStudent === student.id ? "Hide" : "View"} {/* Fixed: Use expandedStudent */}
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expandedStudent === student.id && (
                    <tr>
                      <td colSpan="3" className="p-4 bg-gray-100">
                        <p><strong>Phone:</strong> {student.phone || "N/A"}</p>
                        <p><strong>Gender:</strong> {student.gender || "N/A"}</p>
                        <p><strong>Age:</strong> {student.age || "N/A"}</p>
                        <p><strong>Exam Created:</strong> {student.hasCreatedExam ? "Yes" : "No"}</p>
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

export default StudentList;