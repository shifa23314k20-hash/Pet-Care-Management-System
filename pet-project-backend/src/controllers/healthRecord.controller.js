import HealthRecord from "../model/healthRecord.model.js";
import { v4 as uuidv4 } from "uuid";

export const createHealthRecord = async (req, res) => {
  try {
    const {
      petName,
      weight,
      temperature,
      illness,
      medication,
      veterinarian,
      visitDate,
      notes,
    } = req.body;

    if (
      !petName ||
      weight === undefined ||
      temperature === undefined ||
      !illness ||
      !medication
    ) {
      return res.status(400).json({
        success: false,
        message:
          "petName, weight, temperature, illness and medication are required",
      });
    }

    const healthRecord = await HealthRecord.create({
      id: uuidv4(),
      petName: petName.trim(),
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
    return res.status(500).json({
      success: false,
      message: "Failed to create health record",
      error: error.message,
    });
  }
};

export const updateHealthRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const healthRecord = await HealthRecord.findOneAndUpdate(
      { id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!healthRecord) {
      return res.status(404).json({
        success: false,
        message: "Health record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Health record updated successfully",
      healthRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update health record",
      error: error.message,
    });
  }
};

export const deleteHealthRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const healthRecord = await HealthRecord.findOneAndDelete({ id });

    if (!healthRecord) {
      return res.status(404).json({
        success: false,
        message: "Health record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Health record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete health record",
      error: error.message,
    });
  }
};

export const getAllHealthRecords = async (req, res) => {
  try {
    const healthRecords = await HealthRecord.find().sort({
      visitDate: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: healthRecords.length,
      healthRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch health records",
      error: error.message,
    });
  }
};

export const getHealthRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const healthRecord = await HealthRecord.findOne({ id });

    if (!healthRecord) {
      return res.status(404).json({
        success: false,
        message: "Health record not found",
      });
    }

    return res.status(200).json({
      success: true,
      healthRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch health record",
      error: error.message,
    });
  }
};

export const getHealthRecordsByPetName = async (req, res) => {
  try {
    const { petName } = req.params;

    const healthRecords = await HealthRecord.find({
      petName,
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
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pet health records",
      error: error.message,
    });
  }
};