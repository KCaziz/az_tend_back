// routes/userRoutes.js
import express from "express";
import {
  addMessage,
  askForSubscription,
  checkSubscription,
  getSingleTender,
  updatePassword,
  updatePersonalInfo,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//compléter les champs manquant de user après la connexion avec google
router.patch("/update-profile", protect, updateProfile);

//Mettre à jour profile & password
router.post("/update-password", updatePassword);
router.post("/update-personal-info", updatePersonalInfo);

//Demande d'abonnement
router.post("/askSubscription", askForSubscription);
router.get("/checkSubscription", protect, checkSubscription);

router.get("/tender/:id", protect, getSingleTender);

//Messages
router.post("/message", addMessage);

export default router;
