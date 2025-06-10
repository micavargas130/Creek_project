import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://creek-project.onrender.com", // URL base del backend
  withCredentials: true, //para las cookies
});

export default axiosInstance;