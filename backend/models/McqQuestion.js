import mongoose from "mongoose";

const mcqQuestionSchema = new mongoose.Schema({
  question_text: { type: String, required: true },
  options: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true },
  },
  correct_option: { type: String, required: true },
  marks: { type: Number, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  subjectName: { type: String, required: true }, // subject name entered by teacher
  created_at: { type: Date, default: Date.now }
});

const McqQuestion = mongoose.model("McqQuestion", mcqQuestionSchema);
export default McqQuestion;
