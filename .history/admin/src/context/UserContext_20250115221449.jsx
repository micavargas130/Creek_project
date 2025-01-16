import { createContext, useEffect, useReducer, useState } from "react";
import axios from "axios";

// Configurar la URL base según el entorno
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://creek-project-ruby.vercel.app"
    : "http://localhost:3000";

axios.defaults.baseURL = baseURL; // Configura la base URL para axios
axios.defaults.withCredentials = true; // Permite enviar cookies con las solicitudes

const UserContext = createContext();

// El resto de tu código sigue igual...

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "CLEAR_USER":
      return null;
    default:
      return state;
  }
};

const UserContextProvider = ({ children }) => {
  const [user, dispatchUser] = useReducer(userReducer, null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          dispatchUser({ type: "SET_USER", payload: storedUser });
        } else {
          const response = await axios.get("/profile");
          dispatchUser({ type: "SET_USER", payload: response.data });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        dispatchUser({ type: "CLEAR_USER" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const login = async (credentials) => {
    try {
      console.log(credentials);
      const res = await axios.post("/login", credentials);
      if (res.data.isAdmin || res.data.isEmployee) {
        a
      } else {
        throw new Error("User does not have the required permissions");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Invalid credentials or insufficient permissions");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/logout");
      dispatchUser({ type: "CLEAR_USER" });
      localStorage.removeItem("user"); // Eliminar del localStorage
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, error, login, logout }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
