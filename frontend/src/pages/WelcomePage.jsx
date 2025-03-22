import React, { useState } from "react";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0F1C2E] to-[#1E2A44] flex flex-col overflow-x-hidden text-white font-poppins">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-gradient-to-r from-[#1E2A44] to-[#2C3E50] shadow-xl sticky top-0 z-10 transition-all duration-300">
        <div className="flex items-center gap-3">
          {/* <span className="text-3xl">📚</span> */}
          <h1 className="text-3xl font-bold tracking-wide text-[#A8E6CF] hover:text-[#D5F5E3] transition-colors duration-300">
            Online Examination Portal
          </h1>
        </div>
        <div className="relative">
          <button
            className="px-8 py-2 text-lg font-semibold text-[#0F1C2E] bg-[#A8E6CF] rounded-full cursor-pointer transition-all duration-300 hover:bg-[#D5F5E3] hover:scale-105 shadow-lg hover:shadow-[#A8E6CF]/50"
            onClick={toggleDropdown}
          >
            Login
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#2C3E50] rounded-lg shadow-lg z-10 border border-[#3A547D]">
              <Link
                to="/login"
                className="block px-4 py-2 text-white no-underline hover:bg-[#3A547D] transition-colors duration-200"
                onClick={toggleDropdown}
              >
                Admin Login
              </Link>
              <Link
                to="/teacher-login"
                className="block px-4 py-2 text-white no-underline hover:bg-[#3A547D] transition-colors duration-200"
                onClick={toggleDropdown}
              >
                Teacher Login
              </Link>
              <Link
                to="/student-login"
                className="block px-4 py-2 text-white no-underline hover:bg-[#3A547D] transition-colors duration-200"
                onClick={toggleDropdown}
              >
                Student Login
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8 text-center min-h-[calc(100vh-200px)]">
        <div className="bg-[#2C3E50] rounded-xl p-10 w-full max-w-2xl shadow-lg">
          <h2 className="text-xl font-light opacity-90 mb-4">Welcome to the Future of Learning</h2>
          <h1 className="text-4xl font-bold max-w-2xl mb-6 leading-tight">Assess Your Knowledge Anytime, Anywhere</h1>
          <p className="text-lg max-w-xl mb-8 opacity-90">
            Experience seamless online examinations with our state-of-the-art platform
          </p>
          <div className="flex gap-6 justify-center mb-8">
            <div className="px-6 py-2 bg-white/10 rounded-2xl text-sm font-medium">Secure Testing</div>
            <div className="px-6 py-2 bg-white/10 rounded-2xl text-sm font-medium">Real-time Results</div>
            <div className="px-6 py-2 bg-white/10 rounded-2xl text-sm font-medium">User-friendly Interface</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0F1C2E] p-6">
        <div className="max-w-5xl mx-auto flex justify-between flex-wrap gap-8">
          <div className="min-w-[200px]">
            <h3 className="text-lg font-semibold mb-2">Online Exam Portal</h3>
            <p className="text-sm opacity-80">Empowering education through technology</p>
          </div>
          <div className="min-w-[200px]">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="text-sm opacity-80">Email: sateeshreddymaddi@gmail.com</p>
            <p className="text-sm opacity-80">Phone: +91 9876543211</p>
            <div className="flex gap-4 mt-2">
              <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-white/20">FB</span>
              <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-white/20">TW</span>
              <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-white/20">IG</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-4 pt-2 text-center">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} Online Examination Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
