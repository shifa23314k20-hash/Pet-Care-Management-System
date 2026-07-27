import api from "./api";

export const createVaccination = async (data: any) => {
  const response = await api.post("/vaccination", data);
  return response.data;
};

export const updateVaccination = async (id: string, data: any) => {
  const response = await api.put(`/vaccination/${id}`, data);
  return response.data;
};

export const deleteVaccination = async (id: string) => {
  const response = await api.delete(`/vaccination/${id}`);
  return response.data;
};

export const getAllVaccinations = async () => {
  const response = await api.get("/vaccination");
  return response.data;
};

export const getVaccinationsByPetId = async (petId: string) => {
  const response = await api.get(`/vaccination/pet/${petId}`);
  return response.data;
};

export const getVaccinationHistory = async (petId: string) => {
  const response = await api.get(`/vaccination/history/${petId}`);
  return response.data;
};

export const getUpcomingDueVaccinations = async () => {
  const response = await api.get("/vaccination/due");
  return response.data;
};

export const getVaccinationById = async (id: string) => {
  const response = await api.get(`/vaccination/${id}`);
  return response.data;
};