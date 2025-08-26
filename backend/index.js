// Importing required modules using ES6 syntax
import express from "express"; // Framework for building server-side applications
import cookieParser from "cookie-parser"; // Middleware to parse cookies
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing
import dotenv from "dotenv"; // Load environment variables
import connectDB from "./utils/db.js"; // Database connection function

// Importing route handlers
import userRoute from "./routes/user.route.js"; // User-related routes
import  mealConfirmationRoute  from "./routes/mealConfirmation.route.js"; // Meal confirmation-related routes
import settingsRoute from "./routes/settings.route.js"; // Settings-related routes
import announcementRoute from "./routes/announcement.route.js"; // Announcement-related routes
import feedbackRoute from "./routes/feedback.route.js"; // Feedback-related routes
import messRoute from "./routes/mess.route.js";

//  Load environment variables from .env file
dotenv.config();

// Initialize an Express application
const app = express();

//  Middleware: Parse JSON data in incoming requests
app.use(express.json()); 

//  Middleware: Parse URL-encoded data in incoming requests (e.g., from forms)
app.use(express.urlencoded({ extended: true })); 

//  Middleware: Parse cookies from incoming requests
app.use(cookieParser());

//  CORS configuration to allow requests from the specified origin
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow sending cookies with CORS requests
};

//  Middleware: Enable CORS with the specified options
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute); // User-related routes
app.use("/api/v1/mealconfirmation", mealConfirmationRoute); // Meal confirmation-related routes
app.use("/api/v1/settings", settingsRoute); // Settings-related routes
app.use("/api/v1/announcement", announcementRoute); // Announcement-related routes
app.use("/api/v1/feedback", feedbackRoute); // Feedback-related routes
app.use("/api/v1/mess",messRoute); //Mess-related routes

//  Set the port number for the server
const PORT = process.env.PORT || 3000;

// Connect to the database and start the server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running at port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit process with failure
    });


