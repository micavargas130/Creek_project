import axios from "axios";

// Configurar la URL base y otras opciones
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // URL base del backend
  withCredentials: true, //para las cookies
});

export default axiosInstance;