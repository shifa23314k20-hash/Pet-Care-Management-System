import Pet from "../model/pet.model.js";
import { v4 as uuidv4 } from "uuid";

export const createPet = async (req, res) => {
  try {
    const { userId, name, type, breed, age, gender, weight, healthInfo, petImage } = req.body;

    if (!userId || !name || !type) {
      return res.status(400).json({
        success: false,
        message: "userId, name and type are required",
      });
    }

    const pet = await Pet.create({
      id: uuidv4(),
      userId,
      name,
      type,
      breed: breed || "",
      age: age || 0,
      gender: gender || "male",
      weight: weight || 0,
      healthInfo: healthInfo || "",
      petImage: petImage || "",
    });

    res.status(201).json({
      success: true,
      message: "Pet created successfully",
      pet,
    });
  } catch (error) {
    console.log("CREATE PET ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findOneAndUpdate({id}, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pet updated successfully",
      pet,
    });
  } catch (error) {
    console.log("UPDATE PET ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findOneAndDelete({id});

    res.status(200).json({
      success: true,
      message: "Pet deleted successfully",
    });
  } catch (error) {
    console.log("DELETE PET ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();

    res.status(200).json({
      success: true,
      pets,
    });
  } catch (error) {
    console.log("GET ALL PETS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.find({id});

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    res.status(200).json({
      success: true,
      pet,
    });
  } catch (error) {
    console.log("GET PET BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPetsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const pets = await Pet.find({ userId });

    res.status(200).json({
      success: true,
      pets,
    });
  } catch (error) {
    console.log("GET PETS BY USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
