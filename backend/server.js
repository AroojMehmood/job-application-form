const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// MongoDB se connect karna
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Application routes
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});