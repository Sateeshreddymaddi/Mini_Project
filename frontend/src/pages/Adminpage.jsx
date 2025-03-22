import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { LogOut, Menu, UserPlus, BookOpen, FileText, BarChart, FilePlus2Icon, UserSearch } from "lucide-react";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const data = [
    { title: "Total Students", icon: <UserPlus size={40} />, color: "teal-500", path: "#", value: "120" },
    { title: "Total Teachers", icon: <UserPlus size={40} />, color: "blue-500", path: "#", value: "15" },
    { title: "Total Courses", icon: <BookOpen size={40} />, color: "red-500", path: "#", value: "8" },
    { title: "Total Questions", icon: <FileText size={40} />, color: "brown-500", path: "#", value: "350" },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5, ease: "easeIn" } },
  };

  // Animation variants for sidebar toggle
  const sidebarVariants = {
    open: { x: 0, transition: { duration: 0.3 } },
    closed: { x: "-100%", transition: { duration: 0.3 } },
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Ensure sidebar visibility on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true); 
      } else {
        setIsSidebarOpen(false); // Closed by default on mobile
      }
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white overflow-hidden"
    >
      {/* Navbar */}
      <nav className="bg-gray-800/90 backdrop-blur-md shadow-lg px-4 py-3 sticky top-0 z-50 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Online Exam Portal
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-6">
              <Link to="#" className="hover:text-emerald-400 transition-colors">
                About Us
              </Link>
              <Link to="#" className="hover:text-emerald-400 transition-colors">
                Contact
              </Link>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} className="inline-block mr-2" />
              Logout
            </motion.button>
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-gray-700"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="flex h-[calc(100vh-60px)] w-full">
        {/* Sidebar */}
        <motion.aside
          variants={sidebarVariants}
          animate={isSidebarOpen ? "open" : "closed"}
          className="bg-gradient-to-b from-gray-900 to-emerald-900/80 backdrop-blur-md shadow-lg p-4 w-64 h-full z-40 md:static md:block border-r border-emerald-500/20 overflow-y-auto"
        >
          <div className="flex flex-col items-center mb-6">
            <motion.img
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ duration: 0.5 }}
              src="https://cdn.iconscout.com/icon/free/png-256/free-avatar-icon-download-in-svg-png-gif-file-formats--user-boy-avatars-flat-icons-pack-people-456322.png"
              alt="Admin"
              className="w-20 h-20 rounded-full object-cover border-4 border-gradient-to-r from-teal-400 to-emerald-500 shadow-md"
            />
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-lg font-semibold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent"
            >
              Admin
            </motion.h3>
          </div>
          <nav className="flex-1 space-y-2">
            {[
              { name: "Dashboard", href: "#", icon: <BarChart size={20} /> },
              { name: "Add Student", href: "/add-student", icon: <UserPlus size={20} /> },
              { name: "Add Teacher", href: "/add-teacher", icon: <UserPlus size={20} /> },
              { name: "Add Coding Questions", href: "/Add-Questions", icon: <FilePlus2Icon size={20} /> },
              { name: "Teacher Details", href: "/teachers-list", icon: <UserSearch size={20} /> },
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(16, 185, 129, 0.2)", // emerald-500/20
                  transition: { duration: 0.3 },
                }}
                className={`block p-3 rounded-lg text-gray-200 hover:bg-emerald-500/20 transition-colors duration-300 flex items-center space-x-2 ${
                  location.pathname === item.href ? "bg-emerald-500/30" : ""
                }`}
              >
                <span className="text-emerald-400">{item.icon}</span>
                <Link to={item.href} className="w-full">
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto w-full flex justify-center items-start min-h-full">
          {/* Centered Container for Content */}
          <div className="w-full max-w-4xl flex flex-col items-center space-y-6">
            {/* Greeting Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full p-6 bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg text-center"
            >
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Welcome, Admin!
              </h1>
              <p className="mt-2 text-gray-300 text-sm">
                Manage your online exam portal with ease. Today is {formatDate(new Date())}.
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4"
            >
              {data.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative bg-gray-800/70 backdrop-blur-md rounded-xl p-6 shadow-lg cursor-pointer transition-transform duration-300 w-full text-center"
                  onClick={() => handleCardClick(item.path)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-4xl text-white">{item.icon}</div>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white block mb-2">{item.value}</span>
                    <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default DashboardPage;