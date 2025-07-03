// Importing required modules using ES6 syntax
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

// Importing route handlers
import userRoute from "./routes/user.route.js";
import mealConfirmationRoute from "./routes/mealConfirmation.route.js";
import settingsRoute from "./routes/settings.route.js";
import announcementRoute from "./routes/announcement.route.js";
import feedbackRoute from "./routes/feedback.route.js";
import messRoute from "./routes/mess.route.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration for both local and deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://mess-tickr.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Test route to verify backend is up
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/mealconfirmation", mealConfirmationRoute);
app.use("/api/v1/settings", settingsRoute);
app.use("/api/v1/announcement", announcementRoute);
app.use("/api/v1/feedback", feedbackRoute);
app.use("/api/v1/mess", messRoute);

// Set the port
const PORT = process.env.PORT || 3000;

// Connect to DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });
