import Vaccination from "../model/vaccination.model.js";
import Pet from "../model/pet.model.js";
import { v4 as uuidv4 } from "uuid";

// =========================
// CREATE VACCINATION
// =========================
export const createVaccination = async (req, res) => {
  try {
    const userId = req.user.userId;

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

    // Verify that the pet belongs to the logged-in user
    const pet = await Pet.findOne({
      id: petId,
      userId,
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found or you do not have access to this pet",
      });
    }

    if (isNaN(new Date(dateGiven).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid dateGiven format",
      });
    }

    if (
      nextDueDate &&
      isNaN(new Date(nextDueDate).getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid nextDueDate format",
      });
    }

    const vaccination = await Vaccination.create({
      id: uuidv4(),
      petId,
      userId,
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
    console.log("CREATE VACCINATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create vaccination record",
    });
  }
};


// =========================
// UPDATE VACCINATION
// =========================
export const updateVaccination = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const {
      vaccineName,
      dateGiven,
      nextDueDate,
      notes,
      reminderEnabled,
    } = req.body;

    const vaccination = await Vaccination.findOne({
      id,
      userId,
    });

    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message:
          "Vaccination record not found or you do not have access to it",
      });
    }

    if (
      dateGiven &&
      isNaN(new Date(dateGiven).getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid dateGiven format",
      });
    }

    if (
      nextDueDate &&
      isNaN(new Date(nextDueDate).getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid nextDueDate format",
      });
    }

    vaccination.vaccineName =
      vaccineName ?? vaccination.vaccineName;

    vaccination.dateGiven =
      dateGiven ?? vaccination.dateGiven;

    vaccination.nextDueDate =
      nextDueDate !== undefined
        ? nextDueDate || null
        : vaccination.nextDueDate;

    vaccination.notes =
      notes ?? vaccination.notes;

    vaccination.reminderEnabled =
      reminderEnabled ?? vaccination.reminderEnabled;

    await vaccination.save();

    return res.status(200).json({
      success: true,
      message: "Vaccination record updated successfully",
      vaccination,
    });
  } catch (error) {
    console.log("UPDATE VACCINATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update vaccination record",
    });
  }
};


// =========================
// DELETE VACCINATION
// =========================
export const deleteVaccination = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const vaccination = await Vaccination.findOneAndDelete({
      id,
      userId,
    });

    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message:
          "Vaccination record not found or you do not have access to it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vaccination record deleted successfully",
    });
  } catch (error) {
    console.log("DELETE VACCINATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete vaccination record",
    });
  }
};


// =========================
// GET MY VACCINATIONS
// =========================
export const getAllVaccinations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const vaccinations = await Vaccination.find({
      userId,
    }).sort({
      dateGiven: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: vaccinations.length,
      vaccinations,
    });
  } catch (error) {
    console.log("GET VACCINATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vaccination records",
    });
  }
};


// =========================
// GET VACCINATION BY ID
// =========================
export const getVaccinationById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const vaccination = await Vaccination.findOne({
      id,
      userId,
    });

    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message:
          "Vaccination record not found or you do not have access to it",
      });
    }

    return res.status(200).json({
      success: true,
      vaccination,
    });
  } catch (error) {
    console.log("GET VACCINATION BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vaccination record",
    });
  }
};


// =========================
// GET VACCINATIONS BY PET
// =========================
export const getVaccinationsByPetId = async (req, res) => {
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
        message: "Pet not found or you do not have access to this pet",
      });
    }

    const vaccinations = await Vaccination.find({
      petId,
      userId,
    }).sort({
      dateGiven: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: vaccinations.length,
      vaccinations,
    });
  } catch (error) {
    console.log("GET PET VACCINATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pet vaccination records",
    });
  }
};

export const getVaccinationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const vaccinations = await Vaccination.find({
      userId,
    }).sort({
      dateGiven: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: vaccinations.length,
      vaccinations,
    });
  } catch (error) {
    console.log("GET USER VACCINATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user vaccination records",
    });
  }
};
    



// =========================
// GET VACCINATION HISTORY
// =========================
export const getVaccinationHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { petId } = req.params;

    const pet = await Pet.findOne({
      id: petId,
      userId,
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found or you do not have access to this pet",
      });
    }

    const history = await Vaccination.find({
      petId,
      userId,
    }).sort({
      dateGiven: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.log("GET VACCINATION HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vaccination history",
    });
  }
};


// =========================
// GET UPCOMING DUE VACCINATIONS
// =========================
export const getUpcomingDueVaccinations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const today = new Date();

    const vaccinations = await Vaccination.find({
      userId,
      nextDueDate: {
        $ne: null,
        $gte: today,
      },
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
    console.log("GET DUE VACCINATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming due vaccinations",
    });
  }
};