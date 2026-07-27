import express from "express";
import {
  createGalleryImage,
  getAllGalleryImages,
  getGalleryImagesByPetId,
  getGalleryImagesByUserId,
  deleteGalleryImage,
} from "../controllers/gallery.controller.js";

const router = express.Router();

router.post("/", createGalleryImage);
router.get("/", getAllGalleryImages);
router.get("/pet/:petId", getGalleryImagesByPetId);
router.get("/user/:userId", getGalleryImagesByUserId);
router.delete("/:id", deleteGalleryImage);

export default router;