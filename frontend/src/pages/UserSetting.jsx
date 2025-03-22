import React, { useState, useEffect } from "react";
import axios from "axios";
import PhoneNumberInput from "./PhoneNumberInput";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const UserSettingsPage = () => {
  const navigate = useNavigate();
  const { userType, userId } = useParams();

  if (!userType || !userId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-100 text-red-800 rounded flex justify-center items-center h-screen w-screen"
      >
        Error: Missing user information.
      </motion.div>
    );
  }

  const endpointBase =
    userType === "teacher"
      ? `http://localhost:5001/api/teachers/${userId}`
      : userType === "student"
      ? `http://localhost:5001/api/students/${userId}`
      : null;

  if (!endpointBase) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-100 text-red-800 rounded flex justify-center items-center h-screen w-screen"
      >
        Error: Invalid user type.
      </motion.div>
    );
  }

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    phoneCountryCode: "",
    age: "",
    gender: "",
  });
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [ageError, setAgeError] = useState("");
  const [message, setMessage] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate(userType === "student" ? "/student-login" : "/teacher-login");
          return;
        }
        const res = await axios.get(endpointBase, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setUserData({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          phoneCountryCode: data.phoneCountryCode || "",
          age: data.age || "",
          gender: data.gender || "",
        });
        let photoUrl = data.profilePhotoUrl || "";
        if (photoUrl && !photoUrl.startsWith("http") && !photoUrl.startsWith("data:")) {
          photoUrl = `http://localhost:5001${photoUrl}`;
        }
        setPreviewPhoto(photoUrl);
        setLoadingData(false);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setFetchError(
          "Failed to load settings: " + (error.response?.data?.message || error.message)
        );
        setLoadingData(false);
      }
    };

    fetchSettings();
  }, [endpointBase, navigate, userType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "age") {
      if (value < 1 || value > 120) {
        setAgeError("Age must be between 1 and 120.");
      } else {
        setAgeError("");
      }
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handlePhoneChange = (phoneData) => {
    setUserData((prev) => ({
      ...prev,
      phone: phoneData,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (userData.phone.number && userData.phone.number.length !== 10) {
      setMessage("Phone number must be exactly 10 digits.");
      return;
    }
    if (ageError) {
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone.number || userData.phone);
      formData.append("phoneCountryCode", userData.phone.countryCode || userData.phoneCountryCode);
      if (password.trim()) {
        formData.append("password", password);
      }
      formData.append("age", userData.age);
      formData.append("gender", userData.gender);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }
      const token = localStorage.getItem("token");
      const res = await axios.put(endpointBase, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Settings updated successfully!");
      localStorage.setItem("username", res.data.username || userData.username);
      localStorage.setItem("email", res.data.email || userData.email);
      let photoUrl = res.data.profilePhotoUrl || previewPhoto;
      if (photoUrl && !photoUrl.startsWith("data:") && !photoUrl.startsWith("http") && !photoUrl.startsWith("blob")) {
        photoUrl = `http://localhost:5001${photoUrl}`;
      }
      localStorage.setItem("profilePhotoUrl", photoUrl);
      setPassword("");
      window.dispatchEvent(
        new CustomEvent("userUpdated", {
          detail: {
            username: res.data.username || userData.username,
            email: res.data.email || userData.email,
            profilePhotoUrl: photoUrl,
          },
        })
      );
      setTimeout(() => {
        navigate(userType === "student" ? `/student/${userId}` : `/teacher/${userId}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage("Failed to update settings: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 text-lg font-semibold text-white"
      >
        Loading settings...
      </motion.div>
    );
  }
  if (fetchError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 text-red-500 text-lg"
      >
        {fetchError}
      </motion.div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full max-w-4xl mx-auto flex flex-col p-6 md:p-8 lg:p-10 overflow-y-auto"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            navigate(userType === "student" ? `/student/${userId}` : `/teacher/${userId}`)
          }
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
          {userType === "teacher" ? "Teacher" : "Student"} Settings
        </motion.h2>
        {message && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`mb-6 p-3 rounded-lg text-center shadow-md ${
              message.includes("Failed")
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {message}
          </motion.div>
        )}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 md:p-8 lg:p-10 shadow-lg border border-gray-700 space-y-6"
        >
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Username</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              value={userData.username}
              name="username"
              onChange={handleInputChange}
              readOnly
            />
            <p className="text-xs text-gray-400 mt-1">Username cannot be changed</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              value={userData.email}
              name="email"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Phone Number</label>
            <PhoneNumberInput
              value={userData.phone}
              onChange={handlePhoneChange}
              className="w-full p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password (leave blank to keep unchanged)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Age</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 no-spinner"
              value={userData.age}
              name="age"
              onChange={handleInputChange}
              placeholder="Enter your age"
              min="1"
              max="120"
              required
            />
            {ageError && <p className="text-red-400 text-sm mt-1">{ageError}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Gender</label>
            <select
              className="w-full p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              value={userData.gender}
              name="gender"
              onChange={handleInputChange}
              required
            >
              <option value="" className="text-gray-500">Select Gender</option>
              <option value="Male" className="bg-gray-700">Male</option>
              <option value="Female" className="bg-gray-700">Female</option>
              <option value="Other" className="bg-gray-700">Other</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2">Profile Photo</label>
            <div className="flex items-center space-x-4">
              {previewPhoto && (
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  src={previewPhoto}
                  alt="Profile Preview"
                  className="w-24 h-24 object-cover rounded-full shadow-md"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-3 rounded-lg shadow-md transition-all duration-300 ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Settings"}
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
          scrollbar-width: none; /* Thin scrollbar */
          scrollbar-color:rgb(35, 54, 124) transparent; /* Thumb color and track color */
        }
      `}</style>
    </div>
  );
};

export default UserSettingsPage;