import api from "./api";

export const getAllUsers = async () => {
  const response = await api.get("/user");
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: any) => {
  const response = await api.put(`/user/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/user/${id}`);
  return response.data;
};