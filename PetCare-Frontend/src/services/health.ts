import api from "./api";

export const createHealthRecord = async (data: any) => {
  const response = await api.post("/health-record", data);
  return response.data;
};

export const getAllHealthRecords = async () => {
  const response = await api.get("/health-record");
  return response.data;
};

export const getHealthRecordById = async (id: string) => {
  const response = await api.get(`/health-record/${id}`);
  return response.data;
};

export const getHealthRecordsByPetId = async (petId: string) => {
  const response = await api.get(`/health-record/pet/${petId}`);
  return response.data;
};

export const updateHealthRecord = async (id: string, data: any) => {
  const response = await api.put(`/health-record/${id}`, data);
  return response.data;
};

export const deleteHealthRecord = async (id: string) => {
  const response = await api.delete(`/health-record/${id}`);
  return response.data;
};