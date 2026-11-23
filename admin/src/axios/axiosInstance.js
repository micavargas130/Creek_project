import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://creek-project.onrender.com",
  withCredentials: true, //para las cookies
});

//manda el token de la sesion en cada request (la cookie no siempre viaja entre Vercel y Render)
axiosInstance.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("user") || "null")?.token;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//si la sesion expiro o no es valida, se cierra y se vuelve al login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("user")) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
