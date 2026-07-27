import api from "./api";

export const createBlog = async (data: any) => {
  const response = await api.post("/blog", data);
  return response.data;
};

export const getAllBlogs = async () => {
  const response = await api.get("/blog");
  return response.data;
};

export const getBlogById = async (id: string) => {
  const response = await api.get(`/blog/${id}`);
  return response.data;
};

export const getBlogsByCategory = async (category: string) => {
  const response = await api.get(`/blog/category/${category}`);
  return response.data;
};

export const updateBlog = async (id: string, data: any) => {
  const response = await api.put(`/blog/${id}`, data);
  return response.data;
};

export const deleteBlog = async (id: string) => {
  const response = await api.delete(`/blog/${id}`);
  return response.data;
};