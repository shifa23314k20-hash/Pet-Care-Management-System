import api from "./api";

export const chatWithAI = async (data: any) => {
  const response = await api.post("/ai/chat", data);
  return response.data;
};

export const symptomChecker = async (data: any) => {
  const response = await api.post("/ai/symptom-checker", data);
  return response.data;
};

export const careRecommendation = async (data: any) => {
  const response = await api.post("/ai/care-recommendation", data);
  return response.data;
};

export const vaccinationAssistant = async (data: any) => {
  const response = await api.post("/ai/vaccination-assistant", data);
  return response.data;
};

export const generateHealthReport = async (data: any) => {
  const response = await api.post("/ai/health-report", data, {
    responseType: "blob",
  });
  return response.data;
};