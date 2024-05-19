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
        setLoading(false); // Marca la carga como completa después de obtener los datos
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null); // Establece el usuario en nulo en caso de error
        setLoading(false); // Marca la carga como completa incluso en caso de error
      }
    };

    // Solo carga el perfil del usuario si aún no se ha cargado
    if (!user) {
      fetchUserProfile();
    }
  }, [user]); // Solo se ejecuta cuando el usuario cambia

  // Espera hasta que los datos del perfil del usuario se hayan cargado antes de proporcionar el contexto
  if (loading) {
    return <p>Cargando perfil del usuario...</p>;
  }

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

