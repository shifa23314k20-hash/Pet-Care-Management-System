import api from "./api";

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
