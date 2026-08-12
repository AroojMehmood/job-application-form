# Job Application Form — MERN Stack Project

A full-stack Job Application Form built with **MongoDB, Express, React, and Node.js (MERN)**, featuring a polished drag-and-drop file upload system (resume/image) with live preview and real upload progress, a custom-built dropdown UI, client-side and server-side validation, loading states, and success/error feedback.

---

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- Axios (API calls + real upload progress via `onUploadProgress`)
- FormData (for sending text + file together)
- CSS (custom, responsive, fully custom-styled form controls)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Multer (file upload handling, local disk storage)
- Express static file serving (`/uploads`) for viewing/downloading uploaded files
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
│   │   └── upload.js          (Multer config — storage, file filter, size limit)
│   ├── routes/
│   │   └── applicationRoutes.js
│   ├── uploads/                (uploaded resume/image files, served statically)
│   ├── .env                    (MongoDB URI — not committed to GitHub)
│   ├── .gitignore
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── JobApplicationForm.jsx
    │   │   ├── FileUploadBox.jsx   (drag & drop upload UI + preview + validation)
    │   ├── App.jsx
    │   └── App.css
    └── package.json
```

---

## ✨ Features

- 7 form fields: Full Name, Email, Phone, Date of Birth, Gender (custom dropdown), Experience Level (custom dropdown), Resume/Image upload
- **Drag-and-drop file upload** with a styled file picker fallback (no plain `<input type="file">`)
- **Live file preview** before submission — image thumbnail for JPG/PNG, file icon + name for PDF
- **Real upload progress bar** (via Axios `onUploadProgress`) — reflects actual bytes sent, not a fake timer
- **Frontend file validation** — rejects wrong file types and files over 5MB with specific error messages before hitting the backend
- **Custom-built dropdown component** (replacing native `<select>`) for full styling control across all screen sizes, including mobile
- Client-side validation with field-specific error messages for all form fields
- Server-side validation (never trusts frontend alone) — backend independently re-validates file type and size via Multer
- File upload via Multer — only PDF/JPG/PNG accepted, 5MB size limit, unique filenames to avoid collisions
- **Uploaded file display after success** — image renders inline, PDF shows an "Open / Download" link (served via Express static middleware)
- Loading state ("Submitting...") with disabled button during request
- Success and error banners after submission
- Fully responsive — works on mobile screens, including the upload UI and dropdowns
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
Uploaded files are accessible at `http://localhost:5000/uploads/<filename>`

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
| Valid image dragged & dropped | Preview thumbnail shown before submit |
| Valid file selected via "Choose File" | Preview shown, same as drag-and-drop path |
| Invalid file type selected/dropped | Specific error shown ("Only JPG, PNG, and PDF files are allowed."), file not sent to backend |
| File over 5MB selected/dropped | Specific error shown ("File size must be less than 5 MB."), file not sent to backend |
| Valid file submitted | Real progress bar animates 0–100%, success banner shown |
| After successful upload | Uploaded image renders inline, or PDF shows a working "Open / Download" link |
| Gender / Experience dropdown on mobile width | Custom dropdown stays within the form container, no overflow |
| Page refreshed after upload | Existing form functionality unaffected |
| Responsive check | Form, upload UI, and dropdowns display correctly on mobile-width screens |

Backend was independently tested using **Postman** (form-data body with file upload) to confirm both valid submissions and validation failures work correctly at the API level, independent of the frontend.

---

## 📌 Notes

- Uploaded files are stored on the server's local filesystem (`backend/uploads/`) with only the filename saved in MongoDB — this is the standard, beginner-friendly approach (storing large binary files directly in MongoDB is not recommended).
- Uploaded files are served via Express's static middleware (`app.use("/uploads", express.static("uploads"))`), which gives each file a public URL for preview/download without needing a third-party service like Cloudinary or S3.
- The Gender and Experience fields use a custom-built dropdown component instead of the native HTML `<select>`, because native select popups are rendered by the browser/OS and can visually overflow their container on some screen sizes — a custom component keeps full styling and layout control.
- `.env` and `node_modules` are excluded from version control via `.gitignore` to protect credentials.