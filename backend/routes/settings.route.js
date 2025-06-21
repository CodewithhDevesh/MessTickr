import express from "express";
import {
  updateSettings,
  getCutoffByMessId, 
} from "../controllers/settings.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// POST: update cutoff time
router.route("/").post(isAuthenticated, updateSettings);

// GET: fetch cutoff time by messId
router.route("/cutoff/:messId").get(isAuthenticated, getCutoffByMessId); 

export default router;
