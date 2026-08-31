import Appointment from "../model/appointment.model.js";
import Pet from "../model/pet.model.js";
import { v4 as uuidv4 } from "uuid";

// =========================
// CREATE APPOINTMENT
// =========================
export const createAppointment = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      petId,
      title,
      type,
      dateTime,
      notes,
      reminderEnabled,
      reminderTime,
      status,
    } = req.body;

    if (!petId || !title || !dateTime) {
      return res.status(400).json({
        success: false,
        message: "petId, title and dateTime are required",
      });
    }

    if (isNaN(new Date(dateTime).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid dateTime format",
      });
    }

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

    if (
      reminderTime &&
      isNaN(new Date(reminderTime).getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminderTime format",
      });
    }

    const appointment = await Appointment.create({
      id: uuidv4(),
      userId,
      petId,
      title,
      type: type || "other",
      dateTime,
      notes: notes || "",
      reminderEnabled: reminderEnabled ?? false,
      reminderTime: reminderTime || null,
      status: status || "upcoming",
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.log("CREATE APPOINTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
    });
  }
};


// =========================
// UPDATE APPOINTMENT
// =========================
export const updateAppointment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const {
      title,
      type,
      dateTime,
      notes,
      reminderEnabled,
      reminderTime,
      status,
    } = req.body;

    const appointment = await Appointment.findOne({
      id,
      userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found or you do not have access to it",
      });
    }

    if (
      dateTime &&
      isNaN(new Date(dateTime).getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid dateTime format",
      });
    }

    if (
      reminderTime &&
      isNaN(new Date(reminderTime).getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminderTime format",
      });
    }

    appointment.title = title ?? appointment.title;
    appointment.type = type ?? appointment.type;
    appointment.dateTime = dateTime ?? appointment.dateTime;
    appointment.notes = notes ?? appointment.notes;
    appointment.reminderEnabled =
      reminderEnabled ?? appointment.reminderEnabled;

    appointment.reminderTime =
      reminderTime !== undefined
        ? reminderTime || null
        : appointment.reminderTime;

    appointment.status = status ?? appointment.status;

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.log("UPDATE APPOINTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update appointment",
    });
  }
};


// =========================
// DELETE APPOINTMENT
// =========================
export const deleteAppointment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const appointment = await Appointment.findOneAndDelete({
      id,
      userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found or you do not have access to it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.log("DELETE APPOINTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete appointment",
    });
  }
};


// =========================
// GET MY APPOINTMENTS
// =========================
export const getAllAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const appointments = await Appointment.find({
      userId,
    }).sort({
      dateTime: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.log("GET APPOINTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};


// =========================
// GET APPOINTMENT BY ID
// =========================
export const getAppointmentById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      id,
      userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found or you do not have access to it",
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.log("GET APPOINTMENT BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
    });
  }
};


// =========================
// GET APPOINTMENTS BY PET
// =========================
export const getAppointmentsByPetId = async (req, res) => {
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

    const appointments = await Appointment.find({
      petId,
      userId,
    }).sort({
      dateTime: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.log("GET PET APPOINTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pet appointments",
    });
  }
};