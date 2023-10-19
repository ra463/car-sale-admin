import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  // baseURL: "https://edwin-backend-app.adaptable.app",
});

export default axiosInstance;
