import mongoose from "mongoose";

const mcqSubmissionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: "McqQuestion", required: true },
  selected_option: { type: String, required: true },
  is_correct: { type: Boolean, required: true },
  question_marks: { type: Number, required: true },
  marks_earned: { type: Number, required: true },
  subjectName: { type: String, required: true }, // records subject name from the question
  submitted_at: { type: Date, default: Date.now }
});

const McqSubmission = mongoose.model("McqSubmission", mcqSubmissionSchema);
export default McqSubmission;
