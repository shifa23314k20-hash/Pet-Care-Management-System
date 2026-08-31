import Gallery from "../model/gallery.model.js";
import Pet from "../model/pet.model.js";
import { v4 as uuidv4 } from "uuid";

// =========================
// CREATE GALLERY IMAGE
// =========================
export const createGalleryImage = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { petId, imageUrl } = req.body;

    if (!petId || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "petId and imageUrl are required",
      });
    }

    // Verify pet belongs to logged-in user
    const pet = await Pet.findOne({
      id: petId,
      userId,
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message:
          "Pet not found or you do not have access to this pet",
      });
    }

    const photo = await Gallery.create({
      id: uuidv4(),
      userId,
      petId,
      petName: pet.name,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Photo saved successfully",
      photo,
    });
  } catch (error) {
    console.log("CREATE GALLERY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save photo",
    });
  }
};


// =========================
// GET MY GALLERY
// =========================
export const getAllGalleryImages = async (req, res) => {
  try {
    const userId = req.user.userId;

    const photos = await Gallery.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error) {
    console.log("GET GALLERY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch photos",
    });
  }
};


// =========================
// GET GALLERY BY PET
// =========================
export const getGalleryImagesByPetId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { petId } = req.params;

    // Verify pet ownership
    const pet = await Pet.findOne({
      id: petId,
      userId,
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message:
          "Pet not found or you do not have access to this pet",
      });
    }

    const photos = await Gallery.find({
      petId,
      userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error) {
    console.log("GET PET GALLERY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pet photos",
    });
  }
};


// =========================
// DELETE GALLERY IMAGE
// =========================
export const deleteGalleryImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const deletedPhoto = await Gallery.findOneAndDelete({
      id,
      userId,
    });

    if (!deletedPhoto) {
      return res.status(404).json({
        success: false,
        message:
          "Photo not found or you do not have access to this photo",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.log("DELETE GALLERY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete photo",
    });
  }
};