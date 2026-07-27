import Blog from "../model/blog.model.js";
import { v4 as uuidv4 } from "uuid";

export const createBlog = async (req, res) => {
  try {
    const { title, category, description, image, author } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, category and description are required",
      });
    }

    const blog = await Blog.create({
      id: uuidv4(),
      title: title.trim(),
      category,
      description: description.trim(),
      image: image || "",
      author: author?.trim() || "Admin",
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOneAndDelete({ id });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOne({ id });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

export const getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const blogs = await Blog.find({ category }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};