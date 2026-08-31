import express from "express";

import {
  careRecommendation,
  chatWithAI,
  generateHealthReport,
  symptomChecker,
  vaccinationAssistant,
} from "../controllers/ai.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/chat",
  authMiddleware,
  chatWithAI
);

router.post(
  "/symptom-checker",
  authMiddleware,
  symptomChecker
);

router.post(
  "/care-recommendation",
  authMiddleware,
  careRecommendation
);

router.post(
  "/vaccination-assistant",
  authMiddleware,
  vaccinationAssistant
);

router.post(
  "/health-report",
  authMiddleware,
  generateHealthReport
);

export default router;