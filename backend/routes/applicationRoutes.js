const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const upload = require("../middleware/upload");

// POST /api/applications - naya job application submit karna
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { fullName, email, phone, dateOfBirth, gender, experience } = req.body;

    // ---- SERVER-SIDE VALIDATION ----
    const errors = {};

    if (!fullName || fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phone || !phoneRegex.test(phone)) {
      errors.phone = "Phone number must be at least 10 digits";
    }

    if (!dateOfBirth) {
      errors.dateOfBirth = "Please select a date of birth";
    }

    if (!gender || !["Male", "Female", "Other"].includes(gender)) {
      errors.gender = "Please select your gender";
    }

    const validExperience = ["Fresher", "0-1 years", "1-3 years", "3-5 years", "5+ years"];
    if (!experience || !validExperience.includes(experience)) {
      errors.experience = "Please select your experience level";
    }

    if (!req.file) {
      errors.resume = "Please upload a PDF or image file";
    }

    // Agar koi error hai, to yahin ruk jao aur errors bhej do
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    // ---- SAB SAHI HAI, AB SAVE KARO ----
    const newApplication = new Application({
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      experience,
      resume: req.file.filename, // sirf filename save kar rahe hain
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: newApplication,
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// GET /api/applications/stats - dashboard ke liye aggregated statistics
router.get("/stats", async (req, res) => {
  try {
    const { from, to } = req.query; // optional date range filter

    // Date filter build karo agar from/to diya gaya ho
    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999); // pura din include karo
      dateFilter.$lte = toDate;
    }
    const matchStage = Object.keys(dateFilter).length > 0
      ? { createdAt: dateFilter }
      : {};

    const [total, byGender, byExperience, byDate] = await Promise.all([
      Application.countDocuments(matchStage),

      Application.aggregate([
        { $match: matchStage },
        { $group: { _id: "$gender", count: { $sum: 1 } } },
      ]),

      Application.aggregate([
        { $match: matchStage },
        { $group: { _id: "$experience", count: { $sum: 1 } } },
      ]),

      Application.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Freshers count nikal lo (stat card ke liye)
    const freshersEntry = byExperience.find((e) => e._id === "Fresher");
    const freshersCount = freshersEntry ? freshersEntry.count : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        freshers: freshersCount,
        byGender: byGender.map((g) => ({ name: g._id, value: g.count })),
        byExperience: byExperience.map((e) => ({ name: e._id, value: e.count })),
        byDate: byDate.map((d) => ({ date: d._id, count: d.count })),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics.",
    });
  }
});

module.exports = router;