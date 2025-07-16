import axios from "axios";

const axiosInstance = axios.create({
  baseURL:process.env.REACT_APP_API_URL || "https://creek-project.onrender.com",
  withCredentials: true,
});


export default axiosInstance; 