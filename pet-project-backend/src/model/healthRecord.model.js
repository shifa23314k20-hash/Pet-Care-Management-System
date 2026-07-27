import { Schema, model } from "mongoose";

const healthRecordSchema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        petName: { type: String, required: true, trim: true },
        weight: { type: Number, required: true },
        temperature: { type: Number, required: true },
        illness: { type: String, required: true, trim: true },
        medication: { type: String, required: true, trim: true },
        veterinarian: { type: String, trim: true },
        visitDate: { type: Date, default: Date.now },
        notes: { type: String, trim: true },
    },
    { timestamps: true }
);

const HealthRecord = model("HealthRecord", healthRecordSchema);
export default HealthRecord;