const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

// MongoDB se connect karna — ye sirf normal dev/production run pe chalega
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});