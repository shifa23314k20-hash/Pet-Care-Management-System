import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

console.log(
  "API URL:",
  process.env.EXPO_PUBLIC_BASE_URL
);

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// ATTACH JWT TOKEN
// =========================

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("TOKEN ERROR:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;