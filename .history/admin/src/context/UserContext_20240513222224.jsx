import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/profile");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null); // Establece el usuario en nulo en caso de error
      } finally {
        setLoading(false); // Marca la carga como completa, independientemente del resultado
      }
    };

    // Solo carga el perfil del usuario si aún no se ha cargado
    if (!user) {
      fetchUserProfile();
    }
  }, [user]); // Solo se ejecuta cuando el usuario cambia

  return (
    <UserContext.Provider value={{ user}}>
      {children}
    </UserContext.Provider>
  );
}
