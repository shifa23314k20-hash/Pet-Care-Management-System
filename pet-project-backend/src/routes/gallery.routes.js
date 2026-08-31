import express from "express";

import {
  createGalleryImage,
  getAllGalleryImages,
  getGalleryImagesByPetId,
  deleteGalleryImage,
} from "../controllers/gallery.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createGalleryImage);
router.get("/", authMiddleware, getAllGalleryImages);
router.get("/pet/:petId",authMiddleware, getGalleryImagesByPetId);
router.delete("/:id", authMiddleware, deleteGalleryImage);

export default router;