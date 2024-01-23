import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:4000",
  // baseURL: "https://car-backend.adaptable.app",
  baseURL: "https://api.asisauctions.com.au",
});

export default axiosInstance;
