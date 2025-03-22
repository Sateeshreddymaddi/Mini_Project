import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assumes a User model exists for teachers/admins
    required: true,
  },
  testCases: [
    {
      input: String,
      output: String,
    },
  ],
  marks: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
});

export const Question = mongoose.model("Question", questionSchema);
export default Question;
