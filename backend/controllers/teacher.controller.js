import Teacher from "../models/Teacher.js";
import McqQuestion from "../models/McqQuestion.js";
import Question from "../models/Question.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const addTeacher = async (req, res) => {
  try {
    const { teachers } = req.body; // Expecting an array

    if (!Array.isArray(teachers) || teachers.length === 0) {
      return res.status(400).json({ message: "Invalid data. Provide an array of teachers." });
    }

    // Validate data
    const invalidEntries = teachers.filter((t) => !t.username || !t.password);
    if (invalidEntries.length > 0) {
      return res.status(400).json({ message: "Each teacher must have a username and password." });
    }

    // Check for existing usernames
    const usernames = teachers.map((t) => t.username);
    const existingTeachers = await Teacher.find({ username: { $in: usernames } });

    const existingUsernames = new Set(existingTeachers.map((t) => t.username));
    const newTeachers = teachers.filter((t) => !existingUsernames.has(t.username));

    if (newTeachers.length === 0) {
      return res.status(400).json({ message: "All usernames already exist!" });
    }

    // Hash passwords
    const hashedTeachers = await Promise.all(
      newTeachers.map(async (t) => ({
        username: t.username,
        password: await bcrypt.hash(t.password, 10),
      }))
    );

    // Insert into database
    await Teacher.insertMany(hashedTeachers);

    res.status(201).json({
      message: `Successfully added ${hashedTeachers.length} teacher(s).`,
      addedCount: hashedTeachers.length,
      failedUsernames: [...existingUsernames], // Show failed entries
    });
  } catch (error) {
    console.error("Error adding teachers:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// Teacher Login
export const teacherLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const teacher = await Teacher.findOne({ username });
    if (!teacher) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }
    // Create token payload WITHOUT including the profile photo
    const tokenPayload = {
      id: teacher._id,
      username: teacher.username,
      email: teacher.email,
      phone: teacher.phone,
      phoneCountryCode: teacher.phoneCountryCode,
      age: teacher.age,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({
      token,
      username: teacher.username,
      id: teacher._id,
      email: teacher.email,
      photo: teacher.profilePhotoUrl, // Return photo separately
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

// Get Teacher Details (for settings)
export const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      // Return object with empty fields like in the student controller
      return res.json({
        username: "",
        email: "",
        phone: "",
        phoneCountryCode: "",
        age: "",
        gender: "",
        profilePhotoUrl: "",
      });
    }
    res.json({
      username: teacher.username,
      email: teacher.email,
      phone: teacher.phone,
      phoneCountryCode: teacher.phoneCountryCode,
      age: teacher.age,
      gender: teacher.gender,
      profilePhotoUrl: teacher.profilePhotoUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Teacher Details (with base64 image conversion)
export const updateTeacher = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Convert uploaded image to base64 data URI if provided
    if (req.file && req.file.buffer) {
      const base64Image = req.file.buffer.toString("base64");
      updateData.profilePhotoUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    }
      // Hash new password if provided
      if (req.body.password && req.body.password.trim() !== "") {
        updateData.password = await bcrypt.hash(req.body.password, 10);
      } else {
        // Do not overwrite the existing password with empty value
        delete updateData.password;
      }

    const teacher = await Teacher.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      upsert: true,
    });

    res.json({
      username: teacher.username,
      email: teacher.email,
      phone: teacher.phone,
      phoneCountryCode: teacher.phoneCountryCode,
      age: teacher.age,
      gender: teacher.gender,
      profilePhotoUrl: teacher.profilePhotoUrl,
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all teacher details, including whether they have created any exams
export const getAllTeachers = async (req, res) => {
  try {
    // Fetch all teachers with details (excluding password)
    const teachers = await Teacher.find({}, "-password");

    // Check if each teacher has created exams
    const formattedTeachers = await Promise.all(
      teachers.map(async (teacher) => {
        const hasMcqExam = await McqQuestion.exists({ createdBy: teacher._id });
        const hasCodingExam = await Question.exists({ createdBy: teacher._id });

        return {
          id: teacher._id,
          username: teacher.username,
          email: teacher.email,
          phone: teacher.phone || null,
          phoneCountryCode: teacher.phoneCountryCode || null,
          age: teacher.age || null,
          gender: teacher.gender || null,
          profilePhotoUrl: teacher.profilePhotoUrl || null,
          hasCreatedExam: hasMcqExam || hasCodingExam, // ✅ FIXED: Check MCQ + Coding Exams
          createdAt: teacher.createdAt,
        };
      })
    );

    res.json(formattedTeachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    res.status(200).json({ message: "Teacher deleted successfully." });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};