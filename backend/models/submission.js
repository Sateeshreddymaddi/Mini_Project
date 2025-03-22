import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  output: {
    type: String,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  marks: {
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite error
const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);

export default Submission;
