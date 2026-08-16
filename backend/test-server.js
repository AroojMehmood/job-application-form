const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("./app");

let mongoServer;

// Yeh server SIRF E2E testing ke liye hai — Atlas se kabhi connect nahi hota
(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  console.log("✅ Test MongoDB (in-memory) connected — Atlas NAHI");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🧪 Isolated test server running on http://localhost:${PORT}`);
  });
})();