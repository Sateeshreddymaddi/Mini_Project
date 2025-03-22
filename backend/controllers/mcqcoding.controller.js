import McqCodingQuestion from '../models/mcqcodingquestion.js';
import McqCodingSubmission from '../models/mcqcodingSubmission.js';

export async function addQuestions(req, res) {
  try {
    const question = req.body; // Expecting a single question object instead of an array
    console.log('Received request body:', question); // Log incoming data

    // No need to check if it's an array since we expect a single object
    if (!question || typeof question !== 'object' || Object.keys(question).length === 0) {
      console.log('Validation failed: Invalid question object');
      return res.status(400).json({ message: 'Valid question object is required' });
    }

    console.log('Attempting to insert question into MongoDB');
    const newQuestion = await McqCodingQuestion.create(question); // Create and save single question
    console.log('Successfully inserted question:', newQuestion); // Log successful insertion

    res.status(201).json({
      message: 'Question added successfully',
      question: newQuestion,
    });
  } catch (error) {
    console.error('Error during insertion:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({
      message: 'Failed to add question',
      error: error.message,
    });
  }
}

export async function getAllQuestions(req, res) {
  try {
    const questions = await McqCodingQuestion.find();
    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Failed to fetch questions", error: error.message });
  }
}

async function executeCode(code, language, input) {
  // TODO: Implement secure code execution (e.g., using Judge0 or a sandbox)
  return "Sample Output"; // Placeholder output
}

// Unified submission function
export async function submitQuestion(req, res) {
  try {
    const { studentId, questionId, selectedOption, code, language } = req.body;

    // Validate required fields
    if (!studentId || !questionId) {
      return res.status(400).json({ message: 'Missing required fields: studentId and questionId are required' });
    }

    // Fetch the question to determine its type
    const question = await McqCodingQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    let gainedMarks = 0;
    let submissionData = {
      student: studentId,
      question: questionId,
      type: question.type,
      gainedMarks,
      submittedAt: new Date(),
    };

    // Handle MCQ submission
    if (question.type === 'mcq') {
      if (!selectedOption) {
        return res.status(400).json({ message: 'Selected option is required for MCQ' });
      }
      const isCorrect = selectedOption === question.correct_option;
      gainedMarks = isCorrect ? question.marks : 0;
      submissionData.selectedOption = selectedOption;
    }
    // Handle coding submission
    else if (question.type === 'coding') {
      if (!code || !language) {
        return res.status(400).json({ message: 'Code and language are required for coding questions' });
      }
      const testCaseResults = [];
      let passedCount = 0;

      // Evaluate code against each test case
      for (const testCase of question.testCases) {
        const actualOutput = await executeCode(code, language, testCase.input);
        const passed = actualOutput.trim() === testCase.output.trim();
        if (passed) passedCount++;
        testCaseResults.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput,
          passed,
        });
      }

      // Calculate marks based on passed test cases
      gainedMarks = (passedCount / question.testCases.length) * question.marks;
      submissionData.code = code;
      submissionData.language = language;
      submissionData.testCaseResults = testCaseResults;
    }

    submissionData.gainedMarks = gainedMarks;

    // Save the submission to the database
    const submission = new McqCodingSubmission(submissionData);
    await submission.save();

    // Send response
    res.status(201).json({
      message: 'Submission successful',
      gainedMarks,
      testCaseResults: submissionData.testCaseResults || null,
    });
  } catch (error) {
    console.error('Error submitting question:', error);
    res.status(500).json({ message: 'Failed to submit question', error: error.message });
  }
}