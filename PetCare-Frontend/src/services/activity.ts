import api from "./api";

export const createActivity = async (data: any) => {
  const response = await api.post("/activity", data);
  return response.data;
};

export const getAllActivities = async () => {
  const response = await api.get("/activity");
  return response.data;
};

export const getActivityById = async (id: string) => {
  const response = await api.get(`/activity/${id}`);
  return response.data;
};

export const getActivitiesByUserId = async (userId: string) => {
  const response = await api.get(`/activity/user/${userId}`);
  return response.data;
};

export const getActivitiesByPetId = async (petId: string) => {
  const response = await api.get(`/activity/pet/${petId}`);
  return response.data;
};

export const updateActivity = async (id: string, data: any) => {
  const response = await api.put(`/activity/${id}`, data);
  return response.data;
};

export const deleteActivity = async (id: string) => {
  const response = await api.delete(`/activity/${id}`);
  return response.data;
};