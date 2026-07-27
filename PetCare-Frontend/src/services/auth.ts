import api from "./api";

export const register = async (data: any) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: any) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const forgotPassword = async (data: any) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: any) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};