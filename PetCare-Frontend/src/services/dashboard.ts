import api from "./api";

export const getDashboard = async (userId: string) => {
  const response = await api.get(`/dashboard/${userId}`);
  return response.data;
};