import express from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAllAnnouncements,
} from "../controllers/announcement.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Create a new announcement (admin only)
router.route("/create").post(isAuthenticated, createAnnouncement);

// Get all announcements (public or authenticated users)
router.route("/all").get(getAllAnnouncements);
router.route("/delete/:id").get(isAuthenticated,deleteAnnouncement);

export default router;
