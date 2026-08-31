import express from "express";
import {getAllBlogs, getBlogById, getBlogsByCategory } from "../controllers/blog.controller.js";


const router = express.Router();

router.get("/", getAllBlogs);
router.get("/category/:category", getBlogsByCategory);
router.get("/:id", getBlogById);


export default router;