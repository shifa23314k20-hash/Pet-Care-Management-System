import express from "express";
import { createHealthRecord, deleteHealthRecord, getAllHealthRecords, getHealthRecordById, getHealthRecordsByPetName, updateHealthRecord } from "../controllers/healthRecord.controller.js";

const router = express.Router();

router.post("/", createHealthRecord);
router.get("/", getAllHealthRecords);
router.get("/pet/:petName", getHealthRecordsByPetName);
router.get("/:id", getHealthRecordById);
router.put("/:id", updateHealthRecord);
router.delete("/:id", deleteHealthRecord);

export default router;