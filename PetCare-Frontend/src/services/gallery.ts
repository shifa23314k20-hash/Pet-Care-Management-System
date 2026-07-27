import api from "./api";

export const createGalleryImage = async (data: any) => {
  const response = await api.post("/gallery", data);
  return response.data;
};

export const getAllGalleryImages = async () => {
  const response = await api.get("/gallery");
  return response.data;
};

export const getGalleryImagesByPetId = async (petId: string) => {
  const response = await api.get(`/gallery/pet/${petId}`);
  return response.data;
};

export const getGalleryImagesByUserId = async (userId: string) => {
  const response = await api.get(`/gallery/user/${userId}`);
  return response.data;
};

export const deleteGalleryImage = async (id: string) => {
  const response = await api.delete(`/gallery/${id}`);
  return response.data;
};