# Job Application Form + Analytics Dashboard — MERN Stack Project

A full-stack Job Application system built with **MongoDB, Express, React, and Node.js (MERN)**. It includes a polished drag-and-drop resume upload form with live preview and real upload progress, plus an **Analytics Dashboard** with interactive data visualizations built from real backend data.

---

## 📌 Development Timeline

This project was built incrementally across four sequential internship tasks, all on the same job application form project:

1. **Task 1 — Forms, Validation & Real User Feedback:** Core job application form with client-side and server-side validation, and real-time user feedback (error/success messages).
2. **Task 2 — File/Image Upload UI Connected to Backend Storage:** Drag-and-drop resume upload UI connected to Multer-based backend storage, with live preview and real upload progress tracking.
3. **Task 3 — Dashboard with Data Visualization:** Analytics Dashboard added on top of the form (Recharts visualizations, date-range filter, MongoDB aggregation pipelines).
4. **Task 4 — Testing Across the Stack:** Automated tests added across the full stack — frontend (Vitest + React Testing Library), backend (Vitest + Supertest, isolated via MongoDB Memory Server), and end-to-end (Playwright).

Each task was completed and submitted before work began on the next, so the current `main` branch reflects the combined result of all four.

---

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- Axios (API calls + real upload progress via `onUploadProgress`)
- FormData (for sending text + file together)
- Recharts (dashboard data visualizations — bar, donut/pie, and line charts)
- CSS (custom, responsive, fully custom-styled form and dashboard components)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose (including aggregation pipelines for dashboard statistics)
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
│   │   └── applicationRoutes.js   (POST / — submit application, GET /stats — dashboard analytics)
│   ├── tests/
│   │   ├── setup.js            (starts/stops in-memory MongoDB for tests)
│   │   ├── stats.test.js
│   │   └── applications.test.js
│   ├── uploads/                (uploaded resume/image files, served statically)
│   ├── .env                    (MongoDB URI — not committed to GitHub)
│   ├── .gitignore
│   ├── app.js                  (Express app — no DB connection, used by tests)
│   ├── server.js                (connects to Atlas + starts the real dev server)
│   ├── test-server.js           (isolated server for E2E tests — in-memory MongoDB only)
│   ├── vitest.config.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JobApplicationForm.jsx
│   │   │   ├── JobApplicationForm.test.jsx  (5 frontend tests)
│   │   │   ├── FileUploadBox.jsx   (drag & drop upload UI + preview + validation)
│   │   │   ├── Dashboard.jsx       (analytics dashboard — data fetching, filters, charts)
│   │   │   └── StatCard.jsx        (reusable stat card component)
│   │   ├── setupTests.js       (jest-dom matchers for tests)
│   │   ├── App.jsx                 (view switcher — Form / Dashboard)
│   │   └── App.css
│   └── package.json
│
├── e2e/
│   └── application.spec.js     (Playwright E2E test — full user flow)
│
├── playwright.config.js         (starts backend + frontend, runs E2E tests)
└── package.json                 (root-level, for Playwright)
```

---

## ✨ Features

### Job Application Form
- 7 form fields: Full Name, Email, Phone, Date of Birth, Gender, Experience Level, Resume/Image upload
- **Drag-and-drop file upload** with a styled file picker fallback (no plain `<input type="file">`)
- **Live file preview** before submission — image thumbnail for JPG/PNG, file icon + name for PDF
- **Real upload progress bar** (via Axios `onUploadProgress`) — reflects actual bytes sent, not a fake timer
- **Frontend file validation** — rejects wrong file types and files over 5MB with specific error messages before hitting the backend
- Client-side validation with field-specific error messages for all form fields
- Server-side validation (never trusts frontend alone) — backend independently re-validates all fields and the uploaded file
- File upload via Multer — only PDF/JPG/PNG accepted, 5MB size limit, unique filenames to avoid collisions
- **Uploaded file display after success** — image renders inline, PDF shows an "Open / Download" link (served via Express static middleware)
- Loading state ("Submitting...") with disabled button during request
- Success and error banners after submission
- Fully responsive — works on mobile screens, including the upload UI and dropdowns
- Data persisted in MongoDB Atlas

### Analytics Dashboard
- **View switcher** — a pill-style tab bar lets users toggle between the Application Form and the Dashboard without a page reload (no router needed)
- **3 data visualizations**, all fed by real MongoDB data via a dedicated aggregation endpoint (`GET /api/applications/stats`):
  - **Bar chart** — applications grouped by experience level
  - **Donut chart** — applications grouped by gender
  - **Line chart** — submissions over time (daily count)
- **3 stat cards** — Total Applications, Freshers, Experienced (calculated from real data)
- **Interactive date-range filter** — All Time / Last 7 Days / This Month / Last Month — updates stat cards and all three charts together, no page reload
- **Loading, error, and empty states** — a spinner-equivalent loading message while fetching, a clear error message if the API call fails, and a friendly empty-state message when no data matches the selected filter
- Fully responsive — charts resize using Recharts' `ResponsiveContainer`, layout adapts for tablet and mobile with no horizontal overflow
- Aggregation (total count, gender breakdown, experience breakdown, daily submission counts) is computed server-side in MongoDB using `$match`, `$group`, and `$count`-style aggregation pipelines — not recalculated on the frontend

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
Dashboard statistics are available at `http://localhost:5000/api/applications/stats` (accepts optional `from` and `to` query params, e.g. `?from=2026-08-01&to=2026-08-12`)

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

### Job Application Form

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
| Page refreshed after upload | Existing form functionality unaffected |
| Responsive check | Form, upload UI, and dropdowns display correctly on mobile-width screens |

Backend was independently tested using **Postman** (form-data body with file upload) to confirm both valid submissions and validation failures work correctly at the API level, independent of the frontend.

### Analytics Dashboard

| Test | Expected Result |
|---|---|
| Existing form after adding dashboard | Form still works exactly as before — no regression |
| Dashboard opened with real data present | Stat cards and all 3 charts render actual MongoDB-backed numbers |
| Bar chart | Displays real applications-by-experience data |
| Donut chart | Displays real applications-by-gender data |
| Line chart | Displays real submissions-over-time data |
| Filter changed (e.g. "Last 7 Days") | Stat cards and all 3 charts update immediately, no page reload |
| Mobile width (375px) | No chart overflow, cards stack in a single column, filter buttons wrap correctly |
| Tablet width (768px) | No horizontal scroll, charts and cards resize cleanly |
| Filter selected with no matching data | "No application data available yet." shown instead of broken/empty charts |
| Backend stopped, dashboard refreshed/filtered | "Failed to load dashboard data." error message shown |

---

## 📌 Notes

- Uploaded files are stored on the server's local filesystem (`backend/uploads/`) with only the filename saved in MongoDB — this is the standard, beginner-friendly approach (storing large binary files directly in MongoDB is not recommended).
- Uploaded files are served via Express's static middleware (`app.use("/uploads", express.static("uploads"))`), which gives each file a public URL for preview/download without needing a third-party service like Cloudinary or S3.
- The dashboard's `GET /api/applications/stats` endpoint was added as a new, separate route — the existing `POST /api/applications` submission route and its validation logic were not modified in any way.
- View switching between the Application Form and Dashboard is handled with local React state (`useState`) rather than a routing library, since the app only has two views and a router wasn't already part of the project.
- `.env` and `node_modules` are excluded from version control via `.gitignore` to protect credentials.

## 🧪 Testing

This project has automated tests across the full stack: frontend (Vitest + React Testing Library), backend (Vitest + Supertest), and end-to-end (Playwright).

### ⚠️ Important: Test Database Isolation
All automated tests use **MongoDB Memory Server** (an in-memory MongoDB instance) — **never** the real MongoDB Atlas database. No real data is ever read, written, or deleted during testing.

### Install dependencies
```bash
cd frontend && npm install
cd ../backend && npm install
cd .. && npm install
npx playwright install chromium
```

### Run frontend tests
```bash
cd frontend
npm test
```

### Run backend tests
```bash
cd backend
npm test
```

### Run E2E tests
1. Start the isolated test backend (uses in-memory MongoDB):
```bash
   cd backend
   node test-server.js
```
2. In a separate terminal, start the frontend:
```bash
   cd frontend
   npm run dev
```
3. In a third terminal, from the project root:
```bash
   npx playwright test
```

### Run everything
Frontend and backend tests can each be run independently with `npm test` in their respective folders. E2E tests require both servers running as described above.

### Test Summary
- ✅ 5 frontend tests (rendering, user input, validation)
- ✅ 5 backend tests (successful submission, validation failures)
- ✅ 1 end-to-end test (full user flow: fill form → upload file → submit → success)