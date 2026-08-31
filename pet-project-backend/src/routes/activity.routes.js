import express from "express";

import {
  createActivity,
  deleteActivity,
  getActivitiesByPetId,
  getActivityById,
  getAllActivities,
  updateActivity,
} from "../controllers/activity.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createActivity);

router.get("/", authMiddleware, getAllActivities);

router.get(
  "/pet/:petId",
  authMiddleware,
  getActivitiesByPetId
);

router.get(
  "/:id",
  authMiddleware,
  getActivityById
);

router.put(
  "/:id",
  authMiddleware,
  updateActivity
);

router.delete(
  "/:id",
  authMiddleware,
  deleteActivity
);

export default router;