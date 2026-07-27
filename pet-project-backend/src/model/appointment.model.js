import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    petId: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["vet", "grooming", "vaccination", "training", "checkup", "other"],
      default: "other",
    },
    dateTime: { type: Date, required: true },
    notes: { type: String, default: "" },
    reminderEnabled: { type: Boolean, default: false },
    reminderTime: { type: Date },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
   { timestamps: true }
);

const Appointment = model("Appointment", appointmentSchema);
export default Appointment;