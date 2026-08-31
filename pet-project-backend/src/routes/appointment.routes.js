import express from "express";

import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByPetId,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createAppointment);
router.get("/", authMiddleware, getAllAppointments);
router.get("/pet/:petId", authMiddleware, getAppointmentsByPetId);
router.get("/:id", authMiddleware, getAppointmentById);
router.put("/:id", authMiddleware, updateAppointment);
router.delete("/:id", authMiddleware, deleteAppointment);

export default router;