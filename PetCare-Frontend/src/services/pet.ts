import api from "./api";

export const createPet = async (data: any) => {
  const response = await api.post("/pet/", data);
  return response.data;
};

export const getAllPets = async () => {
  const response = await api.get("/pet/");
  return response.data;
};

export const getPetById = async (id: string) => {
  const response = await api.get(`/pet/${id}`);
  return response.data;
};

export const getPetsByUserId = async () => {
  const response = await api.get("/pet/my-pets");
  return response.data;
};

export const updatePet = async (
  id: string,
  data: any
) => {
  const response = await api.put(
    `/pet/${id}`,
    data
  );

  return response.data;
};

export const deletePet = async (
  id: string
) => {
  const response = await api.delete(
    `/pet/${id}`
  );

  return response.data;
};