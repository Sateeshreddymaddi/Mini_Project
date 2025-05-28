// import mongoose from "mongoose";

// const submissionSchema = new mongoose.Schema({
//   question: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Question",
//     required: true,
//   },
//   code: {
//     type: String,
//     required: true,
//   },
//   output: {
//     type: String,
//   },
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Student",
//   },
//   marks: {
//     type: Number,
//     default: 0,
//   },
//   submittedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Prevent model overwrite error
// const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);

// export default Submission;







import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  testCase: {
    type: Number,
    required: true
  },
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  actualOutput: {
    type: String,
    default: ""
  },
  passed: {
    type: Boolean,
    required: true
  },
  error: {
    type: String,
    default: null
  }
}, { _id: false });

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
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'ruby', 'php', 'csharp', 'go', 'kotlin', 'swift', 'rust']
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
  testResults: [testResultSchema], // Store test case results
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite error
const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);

export default Submission;