import express from "express";
import { createVaccination, getAllVaccinations, getVaccinationById, getVaccinationsByPetId, getVaccinationHistory, getUpcomingDueVaccinations, updateVaccination, deleteVaccination } from "../controllers/vaccination.controller.js";

const router = express.Router();

router.post("/", createVaccination);
router.put("/:id", updateVaccination);
router.delete("/:id", deleteVaccination);
router.get("/", getAllVaccinations);
router.get("/pet/:petId", getVaccinationsByPetId);
router.get("/history/:petId", getVaccinationHistory);
router.get("/due", getUpcomingDueVaccinations);
router.get("/:id", getVaccinationById);

export default router;