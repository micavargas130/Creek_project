import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.VITE_BACKEND_URLmeta.env. || "http://localhost:3000",
  withCredentials: true,
});


export default axiosInstance; 