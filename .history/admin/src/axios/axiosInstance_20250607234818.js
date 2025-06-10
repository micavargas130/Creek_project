import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://creek-project.onrender.com",
  withCredentials: true,
});


export default axiosInstance; 