# Job Application Form — MERN Stack Project

A full-stack Job Application Form built with **MongoDB, Express, React, and Node.js (MERN)**, featuring file upload (resume/image), client-side and server-side validation, loading states, and success/error feedback.

---

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- Axios (API calls)
- FormData (for sending text + file together)
- CSS (custom, responsive)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Multer (file upload handling)
- dotenv (environment variables)
- CORS

---

## 📁 Project Structure

```
job-application-form/
│
├── backend/
│   ├── models/
│   │   └── Application.js
│   ├── middleware/
│   │   └── upload.js
│   ├── routes/
│   │   └── applicationRoutes.js
│   ├── uploads/              (uploaded resume/image files)
│   ├── .env                  (MongoDB URI — not committed to GitHub)
│   ├── .gitignore
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── JobApplicationForm.jsx
    │   ├── App.jsx
    │   └── App.css
    └── package.json
```

---

## ✨ Features

- 7 form fields: Full Name, Email, Phone, Date of Birth, Gender (dropdown), Experience Level (dropdown), Resume/Image upload
- Client-side validation with field-specific error messages
- Server-side validation (never trusts frontend alone)
- File upload via Multer — only PDF/JPG/PNG accepted, 5MB size limit
- Loading state ("Submitting...") with disabled button during request
- Success and error banners after submission
- Fully responsive — works on mobile screens
- Data persisted in MongoDB Atlas

---

## ⚙️ Setup Instructions

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run the backend:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

**Note:** Both backend and frontend servers must run simultaneously (in two separate terminals) for the app to work.

---

## ⚠️ IMPORTANT: MongoDB Connection Troubleshooting

**If the backend shows a MongoDB connection error (`MongoServerSelectionError` or similar), this is NOT a code issue.**

MongoDB Atlas only allows connections from **whitelisted IP addresses** (under Network Access). Many ISPs — especially in Pakistan — assign **dynamic IP addresses**, meaning your IP changes periodically (after router restarts, network switches, etc.). When your IP changes, MongoDB Atlas blocks the connection because the new IP isn't whitelisted yet.

### ✅ How to fix it:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → your project
2. Click **Network Access** in the left sidebar
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
5. Confirm — this permanently resolves the issue for development

**This is a well-known infrastructure limitation of dynamic IP networks and MongoDB Atlas's security model — it is not a bug in the application code.** The backend code, Mongoose connection logic, and error handling are implemented correctly; the connection simply requires the current network IP to be authorized in Atlas.

For production deployments, IP whitelisting is handled differently (e.g. via a fixed server IP or VPC peering), but for local development, "Allow Access from Anywhere" is the standard practice.

---

## 🧪 Testing

The app was tested for the following cases:

| Test | Expected Result |
|---|---|
| Valid data submitted | Data saved in MongoDB, file uploaded, success message shown |
| Required fields left empty | Frontend validation errors shown, no request sent |
| Invalid email/phone/date/file | Field-specific frontend error messages shown |
| Frontend validation bypassed (tested via Postman) | Backend validation still rejects invalid data with specific error messages |

Backend was independently tested using **Postman** (form-data body with file upload) to confirm both valid submissions and validation failures work correctly at the API level, independent of the frontend.

---

## 📌 Notes

- Uploaded files are stored on the server's local filesystem (`backend/uploads/`) with only the filename saved in MongoDB — this is the standard, beginner-friendly approach (storing large binary files directly in MongoDB is not recommended).
- `.env` and `node_modules` are excluded from version control via `.gitignore` to protect credentials.