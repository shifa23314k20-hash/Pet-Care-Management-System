import express from "express";

import { getDashboard } from "../controllers/dashboard.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getDashboard);

export default router;