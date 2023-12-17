import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  // baseURL: "https://car-backend.adaptable.app",
});

export default axiosInstance;
