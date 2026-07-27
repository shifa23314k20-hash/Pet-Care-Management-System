import Activity from "../model/activity.model.js";
import { v4 as uuidv4 } from "uuid";

export const createActivity = async (req, res) => {
  try {
    const {
      userId,
      petId,
      date,
      walkDuration,
      playTime,
      sleepHours,
      notes,
    } = req.body;

    if (
      !userId ||
      !petId ||
      walkDuration === undefined ||
      playTime === undefined ||
      sleepHours === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "userId, petId, walkDuration, playTime and sleepHours are required",
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

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create activity",
      error: error.message,
    });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findOneAndUpdate(
      { id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Activity updated successfully",
      activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findOneAndDelete({ id });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findOne({ id });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getActivitiesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const activities = await Activity.find({ userId }).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getActivitiesByPetId = async (req, res) => {
  try {
    const { petId } = req.params;

    const activities = await Activity.find({ petId }).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
