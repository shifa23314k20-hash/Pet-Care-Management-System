import Activity from "../model/activity.model.js";
import Pet from "../model/pet.model.js";
import { v4 as uuidv4 } from "uuid";

// =========================
// CREATE ACTIVITY
// =========================
export const createActivity = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      petId,
      date,
      walkDuration,
      playTime,
      sleepHours,
      notes,
    } = req.body;

    if (
      !petId ||
      walkDuration === undefined ||
      playTime === undefined ||
      sleepHours === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "petId, walkDuration, playTime and sleepHours are required",
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
        message:
          "Pet not found or you do not have access to this pet",
      });
    }

    if (date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const activity = await Activity.create({
      id: uuidv4(),
      userId,
      petId,
      date: date || Date.now(),
      walkDuration,
      playTime,
      sleepHours,
      notes: notes?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Activity created successfully",
      activity,
    });
  } catch (error) {
    console.log("CREATE ACTIVITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create activity",
    });
  }
};


// =========================
// UPDATE ACTIVITY
// =========================
export const updateActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const {
      date,
      walkDuration,
      playTime,
      sleepHours,
      notes,
    } = req.body;

    const activity = await Activity.findOne({
      id,
      userId,
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message:
          "Activity not found or you do not have access to it",
      });
    }

    if (
      date &&
      isNaN(new Date(date).getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    activity.date = date ?? activity.date;

    activity.walkDuration =
      walkDuration ?? activity.walkDuration;

    activity.playTime =
      playTime ?? activity.playTime;

    activity.sleepHours =
      sleepHours ?? activity.sleepHours;

    activity.notes =
      notes?.trim() ?? activity.notes;

    await activity.save();

    return res.status(200).json({
      success: true,
      message: "Activity updated successfully",
      activity,
    });
  } catch (error) {
    console.log("UPDATE ACTIVITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update activity",
    });
  }
};


// =========================
// DELETE ACTIVITY
// =========================
export const deleteActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const activity = await Activity.findOneAndDelete({
      id,
      userId,
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message:
          "Activity not found or you do not have access to it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ACTIVITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete activity",
    });
  }
};


// =========================
// GET MY ACTIVITIES
// =========================
export const getAllActivities = async (req, res) => {
  try {
    const userId = req.user.userId;

    const activities = await Activity.find({
      userId,
    }).sort({
      date: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.log("GET ACTIVITIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};


// =========================
// GET ACTIVITY BY ID
// =========================
export const getActivityById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const activity = await Activity.findOne({
      id,
      userId,
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message:
          "Activity not found or you do not have access to it",
      });
    }

    return res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    console.log("GET ACTIVITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
    });
  }
};


// =========================
// GET ACTIVITIES BY PET
// =========================
export const getActivitiesByPetId = async (req, res) => {
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

    const activities = await Activity.find({
      petId,
      userId,
    }).sort({
      date: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    console.log("GET PET ACTIVITIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pet activities",
    });
  }
};