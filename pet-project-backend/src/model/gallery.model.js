import { Schema, model } from "mongoose";

const gallerySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    petId: { type: String, required: true },
    petName: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Gallery = model("Gallery", gallerySchema);
export default Gallery;