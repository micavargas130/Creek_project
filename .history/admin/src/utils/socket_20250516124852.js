import { io } from "socket.io-client";

const socket = io(import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:3000"); 

export default socket;