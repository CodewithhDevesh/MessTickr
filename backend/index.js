// Importing required modules using ES6 syntax
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
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

// CORS configuration
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root route
app.get("/", (req, res) => {
  res.send("Backend running with CORS and cookies configured");
});

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/mealconfirmation", mealConfirmationRoute);
app.use("/api/v1/settings", settingsRoute);
app.use("/api/v1/announcement", announcementRoute);
app.use("/api/v1/feedback", feedbackRoute);
app.use("/api/v1/mess", messRoute);

// Server or export handler
if (process.env.NODE_ENV !== "production") {
  // Running locally
  const PORT = process.env.PORT || 3000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("❌ DB connection failed:", error);
      process.exit(1);
    });
} else {
  // For Vercel serverless: connect once
  connectDB().catch((err) => {
    console.error("❌ DB connection failed in Vercel:", err);
  });
}

// Export handler for Vercel
export const handler = serverless(app);
