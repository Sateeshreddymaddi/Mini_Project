import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ClipboardList, FilePlus, CheckSquare, Menu, LogOut, Code} from "lucide-react";
import { motion } from "framer-motion";

export default function TeacherPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [teacherName, setTeacherName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const navigate = useNavigate();
  const { teacherId } = useParams();

  const updateUserDataFromStorage = () => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedPhoto =
      localStorage.getItem("profilePhotoUrl") ||
      "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png";

    if (!token) {
      navigate("/teacher-login");
      return false;
    } else {
      setTeacherName(storedName || "Teacher");
      setEmail(storedEmail || "");
      setProfilePhotoUrl(storedPhoto);
      return true;
    }
  };

  useEffect(() => {
    const isAuthenticated = updateUserDataFromStorage();
    if (isAuthenticated) {
      // Listen for user profile updates (e.g. from settings)
      const handleUserUpdate = (event) => {
        const { username, email, profilePhotoUrl } = event.detail || {};
        if (username) setTeacherName(username);
        if (email) setEmail(email);
        if (profilePhotoUrl) setProfilePhotoUrl(profilePhotoUrl);
      };
      window.addEventListener("userUpdated", handleUserUpdate);

      // Adjust sidebar visibility based on window width
      const handleResize = () => {
        setIsSidebarOpen(window.innerWidth >= 768);
      };
      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("userUpdated", handleUserUpdate);
      };
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", icon: <ClipboardList size={20} />, path: `/teacher/${teacherId}` },
    { name: "Add MCQ's Exam", icon: <FilePlus size={20} />, path: `/teacher/${teacherId}/add-multi-choice` },
    { name: "Add Coding Questions", icon: <Code size={20} />, path: "/Add-Questions" },
    { name: "Add MCQ & Coding", icon: <FilePlus size={20} />, path: `/${teacherId}/add-mcq-coding-question` },
    { name: "Assign Grades", icon: <CheckSquare size={20} />, path: "/assign-marks" },
    { name: "Settings", icon: <ClipboardList size={20} />, path: `/teacher/${teacherId}/settings` },
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
            <h2 className="text-xl font-semibold text-green-400">Teacher Panel</h2>
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
              <h3 className="font-semibold text-white">{teacherName || "Teacher"}</h3>
              <p className="text-sm text-gray-400">{email || "No email set"}</p>
            </div>
          </motion.div>
          <nav className="mt-4 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition w-full text-gray-300 block"
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </nav>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 transition w-full text-left text-gray-300 mt-auto"
          >
            <LogOut size={20} className="text-white" />
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
          {!isSidebarOpen && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden absolute top-4 left-4 p-2 bg-white shadow-lg rounded-full z-40"
            >
              <Menu size={24} />
            </motion.button>
          )}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full h-full border border-gray-700"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="col-span-1 md:col-span-2 lg:col-span-3 p-6 rounded-lg bg-gray-700 text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-green-400">
                Welcome, {teacherName}!
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                Manage exams, evaluations, and student grades from the sidebar.
              </p>
            </motion.div>
            {/* Additional teacher-specific dashboard cards can be added here */}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
