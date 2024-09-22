import express from "express";
import {
  addAdmin,
  addMessage,
  addSector,
  addTender,
  assignSubscription,
  /*updateAdmin, */ deleteAdmin,
  deleteMessage,
  deleteSector,
  deleteSubscription,
  deleteTender,
  getAdmins,
  getEntreprises,
  getJournals,
  getMessages,
  getSectors,
  getSubscriptions,
  getTenders,
  getUsers,
  getUsersInfos,
  markAsSeenMessage,
  updatePassword,
  updatePersonalInfo,
  updateSector,
  updateSubscription,
  getSingleSubscriptions,
  updateTender,
  getSingleTender
} from "../controllers/adminController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

//Tender routes
router.post("/tender", upload.single("image"), addTender); //add a new tender
router.get("/tenders", getTenders); //récupérer tous les tenders
router.get("/tend/:id", protect, restrictTo("admin"), getSingleTender);
router.put("/tender/:id", upload.single("image"), updateTender); // Update a specific tender
router.delete("/tender/:id", protect, restrictTo("admin"), deleteTender); //delete a specific tender

//Secteur routes
router.post("/sector", addSector);
router.get("/sectors", getSectors);
router.put("/sector/:id", protect, restrictTo("admin"), updateSector);
router.delete("/sector/:id", protect, deleteSector);

//Admins Gestion routes
router.post("/new-admin", /*protect, restricTo('SuperAdmin),*/ addAdmin);
router.get("/admins", /*protect, restricTo('SuperAdmin),*/ getAdmins);
router.delete("/admin/:id", /*protect, restricTo('SuperAdmin),*/ deleteAdmin);

//User Gestion routes
router.get("/user", protect, getUsersInfos);
router.get("/users", getUsers);
//Abonnement des utilisateurs
router.post("/abonnement", assignSubscription);
router.put("/abonnement/:id", updateSubscription);
router.delete("/abonnement/:id", deleteSubscription);
router.get("/abonnements", getSubscriptions);
router.get("/abo/:id", protect, restrictTo("admin"), getSingleSubscriptions);


//Messages
router.post("/msg", addMessage);
router.get("/messages", getMessages);
router.delete("/message/:id", deleteMessage);
router.put("/message/:id", markAsSeenMessage);

//Mettre à jour profile & password
router.post("/update-password", protect, updatePassword);
router.post("/update-personal-info", protect, updatePersonalInfo);

//Récupérer les entreprises
router.get("/entreprises", getEntreprises);
//Récupérer les entreprises
router.get("/journals", getJournals);

export default router;
