import { Schema, model } from "mongoose";

const gallerySchema = new Schema(
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

    petName: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Gallery = model("Gallery", gallerySchema);

export default Gallery;