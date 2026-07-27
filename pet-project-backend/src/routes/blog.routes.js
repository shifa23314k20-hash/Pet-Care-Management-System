import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, getBlogsByCategory, updateBlog } from "../controllers/blog.controller.js";


const router = express.Router();

router.post("/", createBlog);
router.get("/", getAllBlogs);
router.get("/category/:category", getBlogsByCategory);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;