import { Schema, model } from "mongoose";

const petSchema = new Schema(
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

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["dog", "cat", "rabbit"],
      required: true,
    },

    breed: {
      type: String,
      default: "",
    },

    age: {
      type: Number,
      default: 0,
      min: 0,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },

    weight: {
      type: Number,
      default: 0,
      min: 0,
    },

    healthInfo: {
      type: String,
      default: "",
    },

    petImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Pet = model("Pet", petSchema);

export default Pet;