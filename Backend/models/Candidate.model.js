const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    experience: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "Shortlisted",
        "Rejected",
        "Interested",
        "Connected",
        "Not Connected",
        "Optional",
      ],
      default: "Not Connected",
    },
    skills: [{ type: String }],
    location: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
