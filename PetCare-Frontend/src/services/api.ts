import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.105:8080/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;