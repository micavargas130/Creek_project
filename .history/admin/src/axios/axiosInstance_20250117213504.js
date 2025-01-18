import axios from "axios";

// Configurar la URL base y otras opciones
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // URL base de tu backend
  withCredentials: true, // Si necesitas enviar cookies o autenticación
});

export default axiosInstance;