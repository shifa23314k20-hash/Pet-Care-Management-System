import Pet from "../model/pet.model.js";
import Vaccination from "../model/vaccination.model.js";
import Appointment from "../model/appointment.model.js";
import Activity from "../model/activity.model.js";
import HealthRecord from "../model/healthRecord.model.js";

export const getDashboard = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Total Pets
        const totalPets = await Pet.countDocuments({ userId });

        // Upcoming Vaccinations
        const upcomingVaccinations = await Vaccination.find({
            userId,
            vaccinationDate: { $gte: new Date() }
        })
            .sort({ vaccinationDate: 1 })
            .limit(5);

        // Upcoming Appointments
        const upcomingAppointments = await Appointment.find({
            userId,
            appointmentDate: { $gte: new Date() }
        })
            .sort({ appointmentDate: 1 })
            .limit(5);

        // Recent Activities
        const recentActivities = await Activity.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5);

        // Latest Health Records
        const recentHealthRecords = await HealthRecord.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5);

        // Simple Health Highlights
        const healthHighlights = {
            totalHealthRecords: recentHealthRecords.length,
            upcomingVaccinations: upcomingVaccinations.length,
            upcomingAppointments: upcomingAppointments.length
        };

        res.status(200).json({
            success: true,
            dashboard: {
                totalPets,
                upcomingVaccinations,
                upcomingAppointments,
                recentActivities,
                healthHighlights
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard",
            error: error.message
        });
    }
};