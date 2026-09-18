import express from "express";

import {
  createVaccination,
  getAllVaccinations,
  getVaccinationById,
  getVaccinationsByPetId,
  getVaccinationsByUserId,
  getVaccinationHistory,
  getUpcomingDueVaccinations,
  updateVaccination,
  deleteVaccination,
} from "../controllers/vaccination.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createVaccination);
router.get("/", authMiddleware, getAllVaccinations);
router.get("/pet/:petId", authMiddleware, getVaccinationsByPetId);
router.get("/user/:userId", authMiddleware, getVaccinationsByUserId);
router.get("/history/:petId", authMiddleware, getVaccinationHistory);
router.get("/due", authMiddleware, getUpcomingDueVaccinations);
router.get("/:id", authMiddleware, getVaccinationById);
router.put("/:id", authMiddleware, updateVaccination);
router.delete("/:id", authMiddleware, deleteVaccination);

export default router;