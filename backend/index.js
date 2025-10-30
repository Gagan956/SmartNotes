import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";

dotenv.config();

const app = express();

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Updated and safer CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://smart-notes.vercel.app",
  "https://smart-notes-beta.vercel.app",
  "https://smart-notes-3wld.vercel.app",
  "https://smart-notes-e4nn.vercel.app"
];

// Or allow all your Vercel preview deployments dynamically
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || /^https:\/\/smart-notes.*\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: " Server is running successfully",
    port: process.env.PORT || 8080,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(` Server is running on port ${PORT}`));
