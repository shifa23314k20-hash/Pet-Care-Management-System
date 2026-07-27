import Vaccination from "../model/vaccination.model.js";
import { v4 as uuidv4 } from "uuid";

export const createVaccination = async (req, res) => {
  try {
    const {
      petId,
      vaccineName,
      dateGiven,
      nextDueDate,
      notes,
      reminderEnabled,
    } = req.body;

    if (!petId || !vaccineName || !dateGiven) {
      return res.status(400).json({
        success: false,
        message: "petId, vaccineName and dateGiven are required",
      });
    }

    if (isNaN(new Date(dateGiven).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid dateGiven format",
      });
    }

    if (nextDueDate && isNaN(new Date(nextDueDate).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid nextDueDate format",
      });
    }

    const vaccination = await Vaccination.create({
      id: uuidv4(),
      petId,
      vaccineName,
      dateGiven,
      nextDueDate: nextDueDate || null,
      notes: notes || "",
      reminderEnabled: reminderEnabled ?? false,
    });

    return res.status(201).json({
      success: true,
      message: "Vaccination record created successfully",
      vaccination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create vaccination record",
      error: error.message,
    });
  }
};

export const updateVaccination = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedVaccination = await Vaccination.findOneAndUpdate(
      { id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedVaccination) {
      return res.status(404).json({
        success: false,
        message: "Vaccination record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vaccination record updated successfully",
      vaccination: updatedVaccination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update vaccination record",
      error: error.message,
    });
  }
};

export const deleteVaccination = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVaccination = await Vaccination.findOneAndDelete({ id });

    if (!deletedVaccination) {
      return res.status(404).json({
        success: false,
        message: "Vaccination record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vaccination record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete vaccination record",
      error: error.message,
    });
  }
};

export const getAllVaccinations = async (req, res) => {
  try {
    const vaccinations = await Vaccination.find().sort({ dateGiven: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: vaccinations.length,
      vaccinations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vaccination records",
      error: error.message,
    });
  }
};

export const getVaccinationById = async (req, res) => {
  try {
    const { id } = req.params;

    const vaccination = await Vaccination.findOne({ id });

    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: "Vaccination record not found",
      });
    }

    return res.status(200).json({
      success: true,
      vaccination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vaccination record",
      error: error.message,
    });
  }
};

export const getVaccinationsByPetId = async (req, res) => {
  try {
    const { petId } = req.params;

    const vaccinations = await Vaccination.findOne({ petId }).sort({
      dateGiven: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: vaccinations.length,
      vaccinations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pet vaccination records",
      error: error.message,
    });
  }
};

export const getVaccinationHistory = async (req, res) => {
  try {
    const { petId } = req.params;

    const history = await Vaccination.find({ petId }).sort({
      dateGiven: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vaccination history",
      error: error.message,
    });
  }
};

export const getUpcomingDueVaccinations = async (req, res) => {
  try {
    const today = new Date();

    const vaccinations = await Vaccination.find({
      nextDueDate: { $ne: null, $gte: today },
      reminderEnabled: true,
    }).sort({
      nextDueDate: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: vaccinations.length,
      vaccinations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming due vaccinations",
      error: error.message,
    });
  }
};

