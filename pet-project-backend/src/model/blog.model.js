import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Summer Care", "Winter Care", "Vaccination", "Grooming", "General"]
    },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    author: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

const Blog = model("Blog", blogSchema);
export default Blog;