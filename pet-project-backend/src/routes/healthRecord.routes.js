import express from "express";

import {
  createHealthRecord,
  deleteHealthRecord,
  getAllHealthRecords,
  getHealthRecordById,
  getHealthRecordsByPetId,
  updateHealthRecord,
} from "../controllers/healthRecord.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createHealthRecord);
router.get("/", authMiddleware, getAllHealthRecords);
router.get("/pet/:petId",authMiddleware, getHealthRecordsByPetId);
router.get("/:id", authMiddleware, getHealthRecordById);
router.put("/:id", authMiddleware, updateHealthRecord);
router.delete("/:id", authMiddleware, deleteHealthRecord);
export default router;