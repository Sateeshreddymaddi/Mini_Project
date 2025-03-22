import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ClipboardList, BookOpen, FileText, Menu, LogOut, ChevronDown , BarChart, GraduationCap} from "lucide-react";
import { motion } from "framer-motion";

export default function StudentPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { studentId } = useParams();

  const updateUserDataFromStorage = () => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedPhoto =
      localStorage.getItem("profilePhotoUrl") ||
      "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png";

    if (!token) {
      navigate("/student-login");
      return false;
    } else {
      setStudentName(storedName || "Student");
      setEmail(storedEmail || "");
      setProfilePhotoUrl(storedPhoto);
      return true;
    }
  };

  useEffect(() => {
    const isAuthenticated = updateUserDataFromStorage();

    if (isAuthenticated) {
      const handleUserUpdate = (event) => {
        const { username, email, profilePhotoUrl } = event.detail || {};
        if (username) setStudentName(username);
        if (email) setEmail(email);
        if (profilePhotoUrl) setProfilePhotoUrl(profilePhotoUrl);
      };

      window.addEventListener("userUpdated", handleUserUpdate);

      const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("userUpdated", handleUserUpdate);
      };
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5001/api/mcq/available-subjects");
        setSubjects(res.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setError("Failed to load available subjects. Please try again later.");
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const toggleExamDropdown = () => {
    setIsExamDropdownOpen((prev) => !prev);
  };

  const handleCodingExam = () => {
    setIsExamDropdownOpen(false);
    navigate(`/student/${studentId}/write-exam`);
  };

  const handleSubjectExam = () => {
    setIsExamDropdownOpen(false);
    setShowSubjectsModal(true);
  };

  const menuItems = [
    { name: "Dashboard", icon: <ClipboardList size={20} />, path: `/student/${studentId}` },
    {
      name: "Take Exam",
      icon: <BookOpen size={20} />,
      path: null,
      dropdown: true,
    },
    { name: "My Results", icon: <GraduationCap size={20} />, path: `/student/${studentId}/result` },
    { name: "Write Exam", icon: <GraduationCap size={20} />, path: `/student/${studentId}/write-mcq-coding` },
    { name: "My Coding Result", icon: <BarChart size={20} />, path: `/exam-result/${studentId}` },
    { name: "Settings", icon: <ClipboardList size={20} />, path: `/student/${studentId}/settings` },
  ];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: isSidebarOpen ? 0 : -250 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-y-0 left-0 bg-gray-800/80 backdrop-blur-md shadow-lg p-4 h-full flex flex-col w-64 z-50 md:w-64 md:relative md:translate-x-0 overflow-y-auto`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-400">Student Panel</h2>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 md:hidden">
              <Menu size={24} className="text-white" />
            </button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center p-4 border-b border-gray-700 mt-4"
          >
            <img
              src={profilePhotoUrl}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover mb-2 shadow-md"
            />
            <div className="text-center">
              <h3 className="font-semibold text-white">{studentName || "Student"}</h3>
              <p className="text-sm text-gray-400">{email || "No email set"}</p>
            </div>
          </motion.div>
          <nav className="mt-4 flex-1">
            {menuItems.map((item) => {
              if (item.dropdown) {
                return (
                  <div key={item.name} className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleExamDropdown}
                      className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-gray-700 transition w-full text-left text-gray-300"
                    >
                      <span className="flex items-center gap-2">
                        {item.icon} {item.name}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`text-gray-300 transition-transform ${
                          isExamDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </motion.button>
                    {isExamDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-1 w-full bg-gray-700 shadow-lg rounded-lg z-10"
                      >
                        <button
                          onClick={handleCodingExam}
                          className="block w-full text-left p-3 text-gray-300 hover:bg-gray-600 transition"
                        >
                          Take Coding Exam
                        </button>
                        <button
                          onClick={handleSubjectExam}
                          className="block w-full text-left p-3 text-gray-300 hover:bg-gray-600 transition"
                        >
                          Take Subject Exam
                        </button>
                      </motion.div>
                    )}
                  </div>
                );
              } else {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition w-full text-gray-300 block"
                  >
                    {item.icon} {item.name}
                  </Link>
                );
              }
            })}
          </nav>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition w-full text-left text-gray-300 mt-auto"
          >
            <LogOut size={20} />
            Logout
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`flex-1 flex flex-col p-6 h-full transition-all duration-300 w-full${
            isSidebarOpen ? "md:ml-64" : "md:ml-0"
          } overflow-y-auto`}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full h-full border border-gray-700"
          >
            {/* Welcome Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w- col-span-1 md:col-span-2 lg:col-span-3 p-6 rounded-lg bg-gray-700 text-center "
            >
              <h1 className="text-4xl md:text-5xl font-bold text-green-400">
                Welcome, {studentName}!
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                You can take exams, view results, and manage settings from the sidebar.
              </p>
            </motion.div>

            {/* Quick Action Cards */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-4 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-green-400">Take Exam</h3>
              <p className="text-gray-300 mt-2">Start a new exam now.</p>
              <button
                onClick={handleSubjectExam}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Start Exam
              </button>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="p-4 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-green-400">View Results</h3>
              <p className="text-gray-300 mt-2">Check your recent scores.</p>
              <Link
                to={`/student/${studentId}/result`}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition block text-center"
              >
                View Results
              </Link>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-4 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-green-400">Settings</h3>
              <p className="text-gray-300 mt-2">Update your profile.</p>
              <Link
                to={`/student/${studentId}/settings`}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition block text-center"
              >
                Go to Settings
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Subjects Modal */}
        {showSubjectsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-700"
            >
              <h2 className="text-2xl font-semibold mb-4 text-green-400">
                Available Subject Exams
              </h2>
              {loadingSubjects ? (
                <p className="text-gray-400">Loading subjects...</p>
              ) : error ? (
                <p className="text-red-400">{error}</p>
              ) : (
                <ul className="space-y-3">
                  {subjects.length > 0 ? (
                    subjects.map((subject, index) => (
                      <motion.li
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                      >
                        <button
                          className="w-full text-left text-white"
                          onClick={() => {
                            setShowSubjectsModal(false);
                            navigate(`/student/${studentId}/multi-choice?subject=${subject}`);
                          }}
                        >
                          {subject}
                        </button>
                      </motion.li>
                    ))
                  ) : (
                    <li className="text-gray-400">No available exams</li>
                  )}
                </ul>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSubjectsModal(false)}
                className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}


// import { useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { ClipboardList, BookOpen, FileText, Menu, LogOut, ChevronDown } from "lucide-react";

// export default function StudentPage() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [studentName, setStudentName] = useState("");
//   const [email, setEmail] = useState("");
//   const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [showSubjectsModal, setShowSubjectsModal] = useState(false);
//   const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
//   const [loadingSubjects, setLoadingSubjects] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { studentId } = useParams(); // Use useParams instead of localStorage

//   const updateUserDataFromStorage = () => {
//     const token = localStorage.getItem("token");
//     const storedName = localStorage.getItem("username");
//     const storedEmail = localStorage.getItem("email");
//     const storedPhoto =
//       localStorage.getItem("profilePhotoUrl") ||
//       "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png";

//     if (!token) {
//       navigate("/student-login");
//       return false;
//     } else {
//       setStudentName(storedName || "Student");
//       setEmail(storedEmail || "");
//       setProfilePhotoUrl(storedPhoto);
//       return true;
//     }
//   };

//   useEffect(() => {
//     const isAuthenticated = updateUserDataFromStorage();
//     if (isAuthenticated) {
//       // ... (rest of the useEffect remains unchanged)
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       setLoadingSubjects(true);
//       setError(null);
//       try {
//         const res = await axios.get("http://localhost:5001/api/mcq/available-subjects");
//         setSubjects(res.data);
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         setError("Failed to load available subjects. Please try again later.");
//       } finally {
//         setLoadingSubjects(false);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/student-login");
//   };

//   const toggleExamDropdown = () => setIsExamDropdownOpen((prev) => !prev);

//   const handleCodingExam = () => {
//     setIsExamDropdownOpen(false);
//     navigate(`/student/${studentId}/write-exam`); // Updated to match route
//   };

//   const handleSubjectExam = () => {
//     setIsExamDropdownOpen(false);
//     setShowSubjectsModal(true);
//   };

//   const menuItems = [
//     { name: "Dashboard", icon: <ClipboardList size={20} />, path: `/student/${studentId}` },
//     { name: "Take Exam", icon: <BookOpen size={20} />, path: null, dropdown: true },
//     { name: "My Results", icon: <FileText size={20} />, path: `/student/${studentId}/result` }, // Consolidated to one result path
//     { name: "Settings", icon: <ClipboardList size={20} />, path: `/student/${studentId}/settings` },
//   ];

//   return (
//     <div className="flex h-screen w-screen bg-gray-100">
//       <div
//         className={`fixed inset-y-0 left-0 bg-white shadow-lg p-4 h-full flex flex-col w-64 transform transition-transform duration-300 z-50 ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0`}
//       >
//         {/* Sidebar content remains largely unchanged */}
//         <nav className="mt-4 flex-1">
//           {menuItems.map((item) => {
//             if (item.dropdown) {
//               return (
//                 <div key={item.name} className="relative">
//                   <button
//                     onClick={toggleExamDropdown}
//                     className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-gray-200 transition w-full text-left"
//                   >
//                     <span className="flex items-center gap-2">{item.icon} {item.name}</span>
//                     <ChevronDown size={20} className={`transition-transform ${isExamDropdownOpen ? "rotate-180" : ""}`} />
//                   </button>
//                   {isExamDropdownOpen && (
//                     <div className="absolute left-0 mt-1 w-full bg-white shadow-lg rounded-lg z-10">
//                       <button onClick={handleCodingExam} className="block w-full text-left p-3 hover:bg-gray-200 transition">
//                         Take Coding Exam
//                       </button>
//                       <button onClick={handleSubjectExam} className="block w-full text-left p-3 hover:bg-gray-200 transition">
//                         Take Subject Exam
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             } else {
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-200 transition w-full block"
//                 >
//                   {item.icon} {item.name}
//                 </Link>
//               );
//             }
//           })}
//         </nav>
//         {/* ... rest of the sidebar */}
//       </div>

//       <div className={`flex-1 flex flex-col p-6 h-full transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-0"}`}>
//         {/* Main content */}
//       </div>

//       {showSubjectsModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-semibold mb-4">Available Subject Exams</h2>
//             {loadingSubjects ? (
//               <p className="text-gray-500">Loading subjects...</p>
//             ) : error ? (
//               <p className="text-red-500">{error}</p>
//             ) : (
//               <ul className="space-y-2">
//                 {subjects.length > 0 ? (
//                   subjects.map((subject, index) => (
//                     <li key={index} className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition">
//                       <button
//                         className="w-full text-left"
//                         onClick={() => {
//                           setShowSubjectsModal(false);
//                           navigate(`/student/${studentId}/multi-choice?subject=${subject}`); // Updated to match route
//                         }}
//                       >
//                         {subject}
//                       </button>
//                     </li>
//                   ))
//                 ) : (
//                   <li className="text-gray-500">No available exams</li>
//                 )}
//               </ul>
//             )}
//             <button
//               onClick={() => setShowSubjectsModal(false)}
//               className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }