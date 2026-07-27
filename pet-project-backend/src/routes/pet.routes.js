import express from "express";
import {
  createPet,
  getAllPets,
  getPetById,
  getPetsByUserId,
  updatePet,
  deletePet,
} from "../controllers/pet.controller.js";

const router = express.Router();

router.post("/", createPet);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);
router.get("/", getAllPets);
router.get("/user/:userId", getPetsByUserId);
router.get("/:id", getPetById);


export default router;