import Blog from "../model/blog.model.js";

// =========================
// GET ALL BLOGS
// =========================
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.log("GET BLOGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};


// =========================
// GET BLOG BY ID
// =========================
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
    console.log("GET BLOG ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};


// =========================
// GET BLOGS BY CATEGORY
// =========================
export const getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const blogs = await Blog.find({
      category,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.log("GET BLOGS BY CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs by category",
    });
  }
};  