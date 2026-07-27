import express from "express";
import { createActivity, deleteActivity, getActivitiesByPetId, getActivitiesByUserId, getActivityById, getAllActivities, updateActivity } from "../controllers/activity.controller.js";


const router = express.Router();

router.post("/", createActivity);
router.get("/", getAllActivities);
router.get("/:id", getActivityById);
router.get("/user/:userId", getActivitiesByUserId);
router.get("/pet/:petId", getActivitiesByPetId);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

export default router;