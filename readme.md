🧠 Smart Notes — MERN Stack App

A full-stack notes management web application built with React, Node.js, Express, and MongoDB.
Users can securely sign up, sign in, manage their profile, and create, edit, delete, and search notes with image uploads and pin functionality.

🚀 Tech Stack
Frontend

React + TypeScript (Vite)

Redux Toolkit (state management)

Tailwind CSS (UI styling)

Axios (API communication)

React Toastify (notifications)

Backend

Node.js + Express.js

MongoDB + Mongoose (database)

Cloudinary (image storage)

JWT (authentication)

Multer (file upload)

CORS (secure cross-origin communication)

⚙️ Features

✅ User Authentication (Signup / Signin / Signout)
✅ JWT-based Secure Routes
✅ Profile Management (with image upload)
✅ CRUD Operations for Notes
✅ Search & Filter Notes
✅ Pin Notes for Quick Access
✅ Note Statistics (total, pinned, recent, top tags)
✅ Image Upload via Cloudinary
✅ Responsive Dashboard (Frontend)


🧩 Backend API Routes
🔐 Auth Routes
router.post("/signup", upload.single("profilePhoto"), signup)
router.post("/signin", signin)
router.get("/signout", verifyToken, signout)
router.get("/profile", verifyToken, getProfile)
router.put("/profile", verifyToken, upload.single("profilePhoto"), updateProfile)

📝 Note Routes
router.post("/add", verifyToken, upload.single("image"), addNote)
router.post("/edit/:noteId", verifyToken, editNote)
router.get("/all", verifyToken, getAllNotes)
router.get("/stats", verifyToken, getNoteStats)
router.delete("/delete/:noteId", verifyToken, deleteNote)
router.put("/update-note-pinned/:noteId", verifyToken, updateNotePinned)
router.get("/search", verifyToken, searchNote)

🧠 Authentication Flow

Signup: Create account with optional profile photo → JWT cookie issued

Signin: Authenticate with email & password → JWT cookie issued

Signout: Clear JWT cookie from client

Protected Routes: All note APIs require valid JWT token

🔧 Environment Variables

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-frontend.vercel.app

📬 Postman Collection / API Docs

You can test APIs using the Postman collection available in:
/backend/docs/SmartNotes.postman_collection.json

Includes all endpoints for Auth and Notes CRUD.

🖥️ Setup Instructions
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev