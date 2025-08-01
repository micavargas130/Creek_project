import axios from "axos";
import { createContext, useEffect, useReducer, useState } from "react";
import axiosInstance from "../../axios/axiosInstance.js"

// Configurar la URL base según el entorno


const UserContext = createContext();

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
      const res = await axiosInstance.post('/login', credentials);
      if (res.data.isAdmin || res.data.isEmployee) {
        dispatchUser({ type: "SET_USER", payload: res.data });
        localStorage.setItem("user", JSON.stringify(res.data)); // Guardar en localStorage
        setError(null); // Limpia el error si la autenticación es exitosaror si la autenticación es exitosa
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

export { UserContext, UserContextProvider  };
