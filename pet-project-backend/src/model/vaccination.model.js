import { Schema, model } from "mongoose";

const vaccinationSchema = new Schema(
  {
    id: { type: String, required: true  , unique: true },
    petId: { type: String, required: true },
    userId: { type: String, required: true },
    vaccineName: { type: String, required: true },
    dateGiven: { type: Date, required: true },
    nextDueDate: { type: Date, default: null },
    notes: { type: String, default: "" },
    reminderEnabled: { type: Boolean, default: false },
  },
   { timestamps: true }
);

const Vaccination = model("Vaccination", vaccinationSchema);
export default Vaccination;