import Pet from "../model/pet.model.js";
import Vaccination from "../model/vaccination.model.js";
import Appointment from "../model/appointment.model.js";
import Activity from "../model/activity.model.js";
import HealthRecord from "../model/healthRecord.model.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const today = new Date();

    // =========================
    // TOTAL PETS
    // =========================
    const totalPets = await Pet.countDocuments({
      userId,
    });

    // =========================
    // UPCOMING VACCINATIONS
    // =========================
    const upcomingVaccinations = await Vaccination.find({
      userId,
      nextDueDate: {
        $ne: null,
        $gte: today,
      },
    })
      .sort({
        nextDueDate: 1,
      })
      .limit(5);

    // =========================
    // UPCOMING APPOINTMENTS
    // =========================
    const upcomingAppointments = await Appointment.find({
      userId,
      dateTime: {
        $gte: today,
      },
      status: "upcoming",
    })
      .sort({
        dateTime: 1,
      })
      .limit(5);

    // =========================
    // RECENT ACTIVITIES
    // =========================
    const recentActivities = await Activity.find({
      userId,
    })
      .sort({
        date: -1,
        createdAt: -1,
      })
      .limit(5);

    // =========================
    // RECENT HEALTH RECORDS
    // =========================
    const recentHealthRecords = await HealthRecord.find({
      userId,
    })
      .sort({
        visitDate: -1,
        createdAt: -1,
      })
      .limit(5);

    // =========================
    // HEALTH HIGHLIGHTS
    // =========================
    const totalHealthRecords = await HealthRecord.countDocuments({
      userId,
    });

    const healthHighlights = {
      totalHealthRecords,
      upcomingVaccinations: upcomingVaccinations.length,
      upcomingAppointments: upcomingAppointments.length,
    };

    // =========================
    // RESPONSE
    // =========================
    return res.status(200).json({
      success: true,

      dashboard: {
        totalPets,
        upcomingVaccinations,
        upcomingAppointments,
        recentActivities,
        recentHealthRecords,
        healthHighlights,
      },
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};