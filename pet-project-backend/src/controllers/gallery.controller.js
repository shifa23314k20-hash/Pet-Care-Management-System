import Gallery from "../model/gallery.model.js";
import { v4 as uuidv4 } from "uuid";

export const createGalleryImage = async (req, res) => {
  try {
    const { userId, petId, petName, imageUrl } = req.body;

    if (!userId || !petId || !petName || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "userId, petId, petName and imageUrl are required",
      });
    }

    const photo = await Gallery.create({
      id: uuidv4(),
      userId,
      petId,
      petName,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Photo saved successfully",
      photo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save photo",
      error: error.message,
    });
  }
};

export const getAllGalleryImages = async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch photos",
      error: error.message,
    });
  }
};

export const getGalleryImagesByPetId = async (req, res) => {
  try {
    const { petId } = req.params;

    const photos = await Gallery.find({ petId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pet photos",
      error: error.message,
    });
  }
};

export const getGalleryImagesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const photos = await Gallery.find({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user photos",
      error: error.message,
    });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPhoto = await Gallery.findOneAndDelete({ id });

    if (!deletedPhoto) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete photo",
      error: error.message,
    });
  }
};