import express from "express";
import {
  submitFeedback,
  getAllFeedbacks,
} from "../controllers/feedback.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Submit feedback (student)
router.route("/submit").post(isAuthenticated, submitFeedback);

// Get all feedbacks (admin)
router.route("/all").get(isAuthenticated, getAllFeedbacks);

export default router;
