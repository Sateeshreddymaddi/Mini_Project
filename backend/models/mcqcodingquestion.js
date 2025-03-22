import mongoose from 'mongoose';

const mcqCodingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['coding', 'mcq'],
    required: true,
  },
  title: {
    type: String,
    required: function () {
      return this.type === 'coding';
    },
  },
  description: {
    type: String,
    required: function () {
      return this.type === 'coding';
    },
  },
  question_text: {
    type: String,
    required: function () {
      return this.type === 'mcq';
    },
  },
  marks: {
    type: Number,
    required: true,
  },
  testCases: [
    {
      input: {
        type: String,
        required: function () {
          return this.parent().type === 'coding';
        },
      },
      output: {
        type: String,
        required: function () {
          return this.parent().type === 'coding';
        },
      },
    },
  ],
  options: {
    A: { type: String },
    B: { type: String },
    C: { type: String },
    D: { type: String },
  },
  correct_option: {
    type: String,
    // enum: ['A', 'B', 'C', 'D'],
    required: function () {
      return this.type === 'mcq';
    },
  },
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
});

// Ensure all options are provided for MCQ questions
mcqCodingSchema.pre('validate', function (next) {
  if (this.type === 'mcq') {
    if (!this.options || !this.options.A || !this.options.B || !this.options.C || !this.options.D) {
      this.invalidate('options', 'All options (A, B, C, D) are required for MCQ questions');
    }
  }
  next();
});

const McqCodingQuestion = mongoose.model('McqCodingQuestion', mcqCodingSchema);
export default McqCodingQuestion;


















// import mongoose from 'mongoose';

// const mcqCodingSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ['coding', 'mcq'],
//     required: true,
//   },
//   title: {
//     type: String,
//     required: function () {
//       return this.type === 'coding';
//     },
//   },
//   description: {
//     type: String,
//     required: function () {
//       return this.type === 'coding';
//     },
//   },
//   question_text: {
//     type: String,
//     required: function () {
//       return this.type === 'mcq';
//     },
//   },
//   marks: {
//     type: Number,
//     required: true,
//   },
//   testCases: [
//     {
//       input: {
//         type: String,
//         required: function () {
//           return this.ownerDocument().type === 'coding';
//         },
//       },
//       output: {
//         type: String,
//         required: function () {
//           return this.ownerDocument().type === 'coding';
//         },
//       },
//     },
//   ],
//   options: {
//     A: { type: String },
//     B: { type: String },
//     C: { type: String },
//     D: { type: String },
//   },
//   correct_option: {
//     type: String,
//     enum: ['A', 'B', 'C', 'D'],
//     required: function () {
//       return this.type === 'mcq';
//     },
//   },
//   subject: {
//     type: String,
//     required: true,
//   },
//   teacher: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: true,
//   },
// });

// // **Pre-validation Middleware**
// mcqCodingSchema.pre('validate', function (next) {
//   if (this.type === 'mcq') {
//     // Ensure all options are provided
//     if (!this.options || !this.options.A || !this.options.B || !this.options.C || !this.options.D) {
//       this.invalidate('options', 'All options (A, B, C, D) are required for MCQ questions');
//     }

//     // Ensure no test cases exist for MCQs
//     if (this.testCases && this.testCases.length > 0) {
//       this.invalidate('testCases', 'MCQ questions should not have test cases');
//     }
//   } else if (this.type === 'coding') {
//     // Ensure no options or correct_option for coding questions
//     if (this.options && (this.options.A || this.options.B || this.options.C || this.options.D)) {
//       this.invalidate('options', 'Coding questions should not have options');
//     }
//     if (this.correct_option) {
//       this.invalidate('correct_option', 'Coding questions should not have a correct option');
//     }
//   }
//   next();
// });

// const McqCodingQuestion = mongoose.model('McqCodingQuestion', mcqCodingSchema);
// export default McqCodingQuestion;
