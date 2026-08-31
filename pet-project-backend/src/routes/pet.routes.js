import express from "express";

import {
  createPet,
  getAllPets,
  getPetById,
  getPetsByUserId,
  updatePet,
  deletePet,
} from "../controllers/pet.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPet);
router.put("/:id", authMiddleware, updatePet);
router.delete("/:id", authMiddleware, deletePet);
router.get("/", authMiddleware, getAllPets);
router.get("/my-pets", authMiddleware, getPetsByUserId);
router.get("/:id", authMiddleware, getPetById);
export default router;