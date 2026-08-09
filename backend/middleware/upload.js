const multer = require("multer");
const path = require("path");

// Storage config - file kahan aur kis naam se save hogi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // is folder mein save hogi
  },
  filename: function (req, file, cb) {
    // unique naam banate hain taake do files ka naam clash na ho
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter - sirf PDF aur images allow karenge
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, and PNG files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;