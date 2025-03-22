import mongoose from 'mongoose';

const mcqcodingsubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'McqCodingQuestion',
    required: true,
  },
  type: {
    type: String,
    enum: ['mcq', 'coding'],
    required: true,
  },
  selectedOption: {
    type: String,
    required: function () {
      return this.type === 'mcq';
    },
  },
  code: {
    type: String,
    required: function () {
      return this.type === 'coding';
    },
  },
  language: {
    type: String,
    required: function () {
      return this.type === 'coding';
    },
  },
  testCaseResults: [
    {
      input: String,
      expectedOutput: String,
      actualOutput: String,
      passed: Boolean,
    },
  ],
  gainedMarks: {
    type: Number,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const mcqcodingSubmission = mongoose.model('McqCodingSubmission', mcqcodingsubmissionSchema);
export default mcqcodingSubmission;