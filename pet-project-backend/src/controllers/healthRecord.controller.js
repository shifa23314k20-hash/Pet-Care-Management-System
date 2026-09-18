import HealthRecord from "../model/healthRecord.model.js";
import Pet from "../model/pet.model.js";
import { v4 as uuidv4 } from "uuid";

// =========================
// CREATE HEALTH RECORD
// =========================
export const createHealthRecord = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      petId,
      weight,
      temperature,
      illness,
      medication,
      veterinarian,
      visitDate,
      notes,
    } = req.body;

    if (
      !petId ||
      weight === undefined ||
      temperature === undefined ||
      !illness ||
      !medication
    ) {
      return res.status(400).json({
        success: false,
        message:
          "petId, weight, temperature, illness and medication are required",
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

    if (visitDate && isNaN(new Date(visitDate).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid visitDate format",
      });
    }

    const healthRecord = await HealthRecord.create({
      id: uuidv4(),
      userId,
      petId,
      weight,
      temperature,
      illness: illness.trim(),
      medication: medication.trim(),
      veterinarian: veterinarian?.trim() || "",
      visitDate: visitDate || Date.now(),
      notes: notes?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Health record created successfully",
      healthRecord,
    });
  } catch (error) {
    console.log("CREATE HEALTH RECORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create health record",
    });
  }
};


// =========================
// UPDATE HEALTH RECORD
// =========================
export const updateHealthRecord = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const {
      weight,
      temperature,
      illness,
      medication,
      veterinarian,
      visitDate,
      notes,
    } = req.body;

    const healthRecord = await HealthRecord.findOne({
      id,
      userId,
    });

    if (!healthRecord) {
      return res.status(404).json({
        success: false,
        message:
          "Health record not found or you do not have access to it",
      });
    }

    if (
      visitDate &&
      isNaN(new Date(visitDate).getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid visitDate format",
      });
    }

    healthRecord.weight =
      weight ?? healthRecord.weight;

    healthRecord.temperature =
      temperature ?? healthRecord.temperature;

    healthRecord.illness =
      illness?.trim() ?? healthRecord.illness;

    healthRecord.medication =
      medication?.trim() ?? healthRecord.medication;

    healthRecord.veterinarian =
      veterinarian?.trim() ?? healthRecord.veterinarian;

    healthRecord.visitDate =
      visitDate ?? healthRecord.visitDate;

    healthRecord.notes =
      notes?.trim() ?? healthRecord.notes;

    await healthRecord.save();

    return res.status(200).json({
      success: true,
      message: "Health record updated successfully",
      healthRecord,
    });
  } catch (error) {
    console.log("UPDATE HEALTH RECORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update health record",
    });
  }
};


// =========================
// DELETE HEALTH RECORD
// =========================
export const deleteHealthRecord = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const healthRecord = await HealthRecord.findOneAndDelete({
      id,
      userId,
    });

    if (!healthRecord) {
      return res.status(404).json({
        success: false,
        message:
          "Health record not found or you do not have access to it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Health record deleted successfully",
    });
  } catch (error) {
    console.log("DELETE HEALTH RECORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete health record",
    });
  }
};


// =========================
// GET MY HEALTH RECORDS
// =========================
export const getAllHealthRecords = async (req, res) => {
  try {
    const userId = req.user.userId;

    const healthRecords = await HealthRecord.find({
      userId,
    }).sort({
      visitDate: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: healthRecords.length,
      healthRecords,
    });
  } catch (error) {
    console.log("GET HEALTH RECORDS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch health records",
    });
  }
};


// =========================
// GET HEALTH RECORD BY ID
// =========================
export const getHealthRecordById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const healthRecord = await HealthRecord.findOne({
      id,
      userId,
    });

    if (!healthRecord) {
      return res.status(404).json({
        success: false,
        message:
          "Health record not found or you do not have access to it",
      });
    }

    const pet = await Pet.findOne({
      id: healthRecord.petId,
      userId,
    }).select(
      "id name species breed image photo"
    );

    return res.status(200).json({
      success: true,

      healthRecord,

      pet: pet || null,
    });
  } catch (error) {
    console.log(
      "GET HEALTH RECORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch health record",
    });
  }
};


// =========================
// GET HEALTH RECORDS BY PET
// =========================
export const getHealthRecordsByPetId = async (req, res) => {
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

    const healthRecords = await HealthRecord.find({
      petId,
      userId,
    }).sort({
      visitDate: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: healthRecords.length,
      healthRecords,
    });
  } catch (error) {
    console.log("GET PET HEALTH RECORDS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pet health records",
    });
  }
};