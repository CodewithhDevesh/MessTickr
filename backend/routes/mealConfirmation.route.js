import express from "express";
import {
  createOrUpdateMealConfirmation,
  updateMealConfirmation,
  getMealConfirmation,
} from "../controllers/mealConfirmation.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/:userId/:date").get(isAuthenticated, getMealConfirmation);
router.route("/").post(isAuthenticated, createOrUpdateMealConfirmation);
router.route("/update").put(isAuthenticated, updateMealConfirmation);  // New update route

export default router;
