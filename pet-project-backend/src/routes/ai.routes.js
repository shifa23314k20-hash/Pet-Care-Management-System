import express from "express";
import { careRecommendation, chatWithAI, generateHealthReport, symptomChecker, vaccinationAssistant } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/chat", chatWithAI);
router.post("/symptom-checker", symptomChecker);
router.post("/care-recommendation", careRecommendation);
router.post("/vaccination-assistant", vaccinationAssistant);
router.post("/health-report", generateHealthReport);

export default router;