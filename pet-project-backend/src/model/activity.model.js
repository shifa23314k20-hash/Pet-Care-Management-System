import { Schema, model } from "mongoose";

const activitySchema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        userId: { type: String, required: true },
        petId: { type: String, required: true },
        date: { type: Date, default: Date.now },
        walkDuration: { type: Number, required: true, min: 0 },
        playTime: { type: Number, required: true, min: 0 },
        sleepHours: { type: Number, required: true, min: 0, max: 24 },
        notes: { type: String, trim: true, default: "" },
    },
    { timestamps: true }
);

const Activity = model("Activity", activitySchema);
export default Activity;