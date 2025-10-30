import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const Port = process.env.PORT || 3000;
// to make input as json
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  process.env.Frontend_URL,
  "http://localhost:5173",
  "https://smart-notes-3wld-holyid6vr-gagans-projects-27b6b951.vercel.app", // Vercel preview
  "https://smart-notes-3wld.vercel.app", // main deployed frontend
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// Serve uploaded files
app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 8080

app.get("/", (req, res) => {
    res.json({
        message: "Server is running",
        port: PORT
    })
})
  
app.listen(Port, () => {
  console.log("Server is running on port ", Port);
});

// import routes
import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";

app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

// error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Serer Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
