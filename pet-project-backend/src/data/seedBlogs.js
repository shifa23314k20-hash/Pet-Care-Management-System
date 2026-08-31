import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Blog from "../model/blog.model.js";
import blogs from "./blogs.js";

dotenv.config();

const seedBlogs = async () => {
  try {
    await connectDB();

    await Blog.deleteMany({});

    await Blog.insertMany(blogs);

    console.log("Blogs seeded successfully");
    console.log(`${blogs.length} blogs inserted`);

    process.exit(0);
  } catch (error) {
    console.error("Blog seed error:", error);
    process.exit(1);
  }
};

seedBlogs();