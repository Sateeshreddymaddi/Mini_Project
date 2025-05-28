import mongoose from "mongoose";

const examSettingsSchema = new mongoose.Schema({
  subjectName: { 
    type: String, 
    required: true, 
    unique: true, 
  },
  examDuration: { 
    type: Number, 
    required: true, // in minutes
  }, 
});

const ExamSettings = mongoose.model("ExamSettings", examSettingsSchema);
export default ExamSettings;