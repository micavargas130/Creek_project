import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // URL base del backend
  withCredentials: true, //para las cookies
});

export default axiosInstance;