import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TeacherLoginPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await fetch("http://localhost:5001/api/teachers/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            console.log("Login API Response:", data); // Debugging
    
            if (response.ok) {
                if (data.id && data.username) { 
                    localStorage.setItem("teacher_id", data.id); // Store teacher id here
                    localStorage.setItem("username", data.username);
                    localStorage.setItem("token", data.token);
                    toast.success(`Welcome, ${data.username}!`);
                    navigate(`/teacher/${data.id}`);
                } else {
                    console.warn("Teacher ID or Username missing in API response:", data);
                    toast.error("Login successful, but missing user details!");
                }
            } else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (error) {
            toast.error("Server error. Check your connection.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#0F1C2E] to-[#1E2A44] flex items-center justify-center p-4 font-poppins ">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Teacher Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full p-2 border rounded-lg focus:ring focus:ring-green-400"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full p-2 border rounded-lg focus:ring focus:ring-green-400"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeacherLoginPage;
