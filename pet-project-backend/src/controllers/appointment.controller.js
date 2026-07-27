import Appointment from "../model/appointment.model.js";
import User from "../model/user.model.js";
import { v4 as uuidv4 } from "uuid";

export const createAppointment = async (req, res) => {
  try {
    const {userId, petId, title, type, dateTime, notes, reminderEnabled, reminderTime, status } = req.body;

    if (!userId || !petId || !title || !dateTime) {
      return res.status(400).json({
        success: false,
        message: "userId, petId, title and dateTime are required",
      });
    }

    const appointment = await Appointment.create({ id: uuidv4(), userId, petId, title, type, dateTime, notes, reminderEnabled, reminderTime, status });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: error.message,
    });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAppointment = await Appointment.findOneAndDelete({ id });

    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete appointment",
      error: error.message,
    });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({createdAt: -1});

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOne({ id });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
      error: error.message,
    });
  }
};

export const getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const appointments = await Appointment.find({ userId }).sort({
      dateTime: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user appointments",
      error: error.message,
    });
  }
};

export const getAppointmentsByPetId = async (req, res) => {
  try {
    const { petId } = req.params;

    const appointments = await Appointment.find({ petId }).sort({
      dateTime: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pet appointments",
      error: error.message,
    });
  }
};