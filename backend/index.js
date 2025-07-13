import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db/connectDB.js"; 
import authRoutes from "./routes/auth.route.js";
import questionRoutes from "./routes/question.route.js";
import examRoutes from "./routes/exam.route.js";
import teacherRoutes from "./routes/teacher.route.js";
import studentRoutes from "./routes/student.route.js";
import mcqRoutes from "./routes/mcq.routes.js";
import mcqcodingRoutes from "./routes/mcqcoding.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/mcq", mcqRoutes);
app.use("/api/mcqcoding", mcqcodingRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("✅ Server is running on port:", PORT);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error);
  });
