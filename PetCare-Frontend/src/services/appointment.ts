import api from "./api";

export const createAppointment = async (data: any) => {
  const response = await api.post("/appointment", data);
  return response.data;
};

export const getAllAppointments = async () => {
  const response = await api.get("/appointment");
  return response.data;
};

export const getAppointmentById = async (id: string) => {
  const response = await api.get(`/appointment/${id}`);
  return response.data;
};

export const getAppointmentsByUserId = async (userId: string) => {
  const response = await api.get(`/appointment/user/${userId}`);
  return response.data;
};

export const getAppointmentsByPetId = async (petId: string) => {
  const response = await api.get(`/appointment/pet/${petId}`);
  return response.data;
};

export const updateAppointment = async (id: string,data:any) => {
  const response = await api.put(`/appointment/${id}`, data);
  return response.data;
};

export const deleteAppointment = async (id: string) => {
  const response = await api.delete(`/appointment/${id}`);
  return response.data;
};