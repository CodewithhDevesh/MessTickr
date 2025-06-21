import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  registerMess,
  getAllMesses,
  getMessById,
  selectMess,
  getSelectedMess,
  getMessWithStudentsAndMeals,  // <-- import the new controller
} from "../controllers/mess.controller.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, registerMess);
router.route("/all").get(isAuthenticated, getAllMesses);
router.route("/:id").get(isAuthenticated, getMessById);
router.route("/select").post(isAuthenticated, selectMess);
router.route("/selected/:id").get(isAuthenticated, getSelectedMess);
router.route("/admin/:id/mess-preferences").get(isAuthenticated, getMessWithStudentsAndMeals);

export default router;
