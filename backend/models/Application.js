const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  experience: {
    type: String,
    required: true,
    enum: ["Fresher", "0-1 years", "1-3 years", "3-5 years", "5+ years"],
  },
  resume: {
    type: String, // file ka naam/path store hoga, actual file nahi
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Application", applicationSchema);