import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String },              // Full phone number (digits only)
  phoneCountryCode: { type: String },     // Country code (e.g., "+1")
  age: { type: Number },
  gender: { type: String },
  profilePhotoUrl: { type: String }       // URL of the profile photo
}, { timestamps: true });

export default mongoose.model("Student", StudentSchema);
