import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const addStudents = async (req, res) => {
  const { students } = req.body; // Expecting an array of students with username and password

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: "Students array is required!" });
  }

  try {
    const existingUsernames = new Set(
      (await Student.find({ username: { $in: students.map(s => s.username) } })).map(s => s.username)
    );

    const newStudents = await Promise.all(
      students
        .filter(student => !existingUsernames.has(student.username)) // Skip existing usernames
        .map(async student => ({
          username: student.username,
          password: await bcrypt.hash(student.password, 10)
        }))
    );

    if (newStudents.length > 0) {
      await Student.insertMany(newStudents);
    }

    res.status(201).json({
      message: "Students added successfully!",
      added: newStudents.length,
      skipped: students.length - newStudents.length
    });
  } catch (error) {
    console.error("Error adding students:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Student Login
export const studentLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }
    // Create token payload WITHOUT including the profile photo
    const tokenPayload = {
      id: student._id,
      username: student.username,
      email: student.email,
      phone: student.phone,
      phoneCountryCode: student.phoneCountryCode,
      age: student.age,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({
      token,
      username: student.username,
      id: student._id,
      email: student.email,
      photo: student.profilePhotoUrl, // Return photo separately
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Student Details (for settings)
export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.json({
        email: "",
        phone: "",
        phoneCountryCode: "",
        age: "",
        gender: "",
        profilePhotoUrl: "",
      });
    }
    res.json({
      username: student.username,
      email: student.email,
      phone: student.phone,
      phoneCountryCode: student.phoneCountryCode,
      age: student.age,
      gender: student.gender,
      profilePhotoUrl: student.profilePhotoUrl, // This should be the base64 data URI
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Student Details (for settings) with base64 image conversion
export const updateStudent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Convert uploaded image to base64 data URI if a file is provided
    if (req.file && req.file.buffer) {
      const base64Image = req.file.buffer.toString("base64");
      updateData.profilePhotoUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    //   console.log("Profile photo stored as base64.");
    }

    // Hash new password if provided
    if (req.body.password && req.body.password.trim() !== "") {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    } else {
      // Do not overwrite the existing password with empty value
      delete updateData.password;
    }

    const student = await Student.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      upsert: true,
    });
    res.json(student);
  } catch (error) {
    console.error("Error in updateStudent:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    // Fetch all teachers with details (excluding password)
    const students = await Student.find({}, "-password");

    // Check if each teacher has created exams
    const formattedTeachers = await Promise.all(
      students.map(async (teacher) => {
        // const hasMcqExam = await McqQuestion.exists({ createdBy: teacher._id });
        // const hasCodingExam = await Question.exists({ createdBy: teacher._id });

        return {
          id: students._id,
          username: students.username,
          email: students.email,
          phone: students.phone || null,
          phoneCountryCode: students.phoneCountryCode || null,
          age: students.age || null,
          gender: students.gender || null,
          profilePhotoUrl: students.profilePhotoUrl || null,
          // hasCreatedExam: hasMcqExam || hasCodingExam, // ✅ FIXED: Check MCQ + Coding Exams
          // createdAt: teacher.createdAt,
        };
      })
    );

    res.json(formattedStudent);
  } catch (error) {
    console.error("Error fetching Students:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.status(200).json({ message: "Student deleted successfully." });
  } catch (error) {
    console.error("Error deleting Student:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};