import express from "express";
import { createAppointment, getAllAppointments, getAppointmentById, getAppointmentsByUserId, getAppointmentsByPetId, updateAppointment, deleteAppointment } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.get("/:id", getAppointmentById);
router.get("/user/:userId", getAppointmentsByUserId);
router.get("/pet/:petId", getAppointmentsByPetId);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;