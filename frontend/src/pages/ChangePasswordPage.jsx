import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ChangePasswordPage = () => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token"); // ✅ Get auth token

            const response = await fetch("http://localhost:5001/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password updated successfully!");
                navigate("/dashboard"); // ✅ Redirect after password update
            } else {
                toast.error(data.message || "Failed to change password.");
            }
        } catch (error) {
            toast.error("Server error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-h-screen flex items-center justify-center bg-red-100">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} placeholder="Old Password" className="w-full p-2 border rounded" required />
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New Password" className="w-full p-2 border rounded" required />
                    <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} placeholder="Confirm New Password" className="w-full p-2 border rounded" required />
                    <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">{loading ? "Updating..." : "Change Password"}</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;