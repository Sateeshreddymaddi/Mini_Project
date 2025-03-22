import { useState } from "react";

const UpdateEmailPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/update-email", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        setMessage(data.message);
    };

    return (
        <div className="container">
            <h2>Update Email</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Update</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdateEmailPage;
