import { Schema, model } from "mongoose";

const healthRecordSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    petId: {
      type: String,
      required: true,
      index: true,
    },

    weight: {
      type: Number,
      required: true,
      min: 0,
    },

    temperature: {
      type: Number,
      required: true,
      min: 0,
    },

    illness: {
      type: String,
      required: true,
      trim: true,
    },

    medication: {
      type: String,
      required: true,
      trim: true,
    },

    veterinarian: {
      type: String,
      trim: true,
      default: "",
    },

    visitDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

const HealthRecord = model("HealthRecord", healthRecordSchema);

export default HealthRecord;