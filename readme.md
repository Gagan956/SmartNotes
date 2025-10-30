# 🧠 Smart Notes — MERN Stack App

A full-stack **Notes Management Web Application** built with **React, Node.js, Express, and MongoDB**.  
Users can securely **sign up, log in, manage their profile, and create, edit, delete, search, and pin notes** — all with Cloudinary image uploads and JWT authentication.

---

## 🚀 Tech Stack

### 🖥️ Frontend
- ⚛️ **React (Vite)**
- 🧩 **Redux Toolkit** — State Management
- 🎨 **Tailwind CSS** — Modern, responsive UI
- 🌐 **Axios** — API communication
- 🔔 **React Toastify** — Notifications

### ⚙️ Backend
- 🧠 **Node.js + Express.js**
- 🗄️ **MongoDB + Mongoose** — Database
- ☁️ **Cloudinary** — Image Storage
- 🔐 **JWT** — Authentication
- 📸 **Multer** — File Uploads
- 🔄 **CORS** — Secure cross-origin access

---

## ✨ Features

✅ Secure User Authentication (Signup / Signin / Signout)  
✅ JWT-based Protected Routes  
✅ Profile Management with Image Upload  
✅ CRUD Operations for Notes  
✅ Search & Filter Functionality  
✅ Pin Notes for Quick Access  
✅ Note Statistics (Total, Pinned, Recent, Top Tags)  
✅ Cloudinary Image Upload Integration  
✅ Fully Responsive Dashboard UI  

---

## 🧩 Backend API Routes

### 🔐 Auth Routes
```js
router.post("/signup", upload.single("profilePhoto"), signup)
router.post("/signin", signin)
router.get("/signout", verifyToken, signout)
router.get("/profile", verifyToken, getProfile)
router.put("/profile", verifyToken, upload.single("profilePhoto"), updateProfile)


Note Routes
router.post("/add", verifyToken, upload.single("image"), addNote)
router.post("/edit/:noteId", verifyToken, editNote)
router.get("/all", verifyToken, getAllNotes)
router.get("/stats", verifyToken, getNoteStats)
router.delete("/delete/:noteId", verifyToken, deleteNote)
router.put("/update-note-pinned/:noteId", verifyToken, updateNotePinned)
router.get("/search", verifyToken, searchNote)



🧠 Authentication Flow

🔸 Signup → Create account with optional profile photo → JWT cookie issued
🔸 Signin → Authenticate with email & password → JWT cookie issued
🔸 Signout → Clear JWT cookie from client
🔸 Protected Routes → Accessible only with valid JWT token

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

Test the APIs easily using the Postman collection:

📁 /backend/docs/SmartNotes.postman_collection.json

Includes all endpoints for:

🔐 Authentication

📝 Notes CRUD

📊 Stats & Search

🖥️ Setup Instructions
🔹 Backend
cd backend
npm install
npm run dev

🔹 Frontend
cd frontend
npm install
npm run dev


Visit ➜ http://localhost:5173
