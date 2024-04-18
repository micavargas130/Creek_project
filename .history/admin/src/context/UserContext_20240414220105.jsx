import {createContext, useEffect, useState} from "react";
import axios from "axios";


export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // Inicialmente no está listo

  useEffect(() => {
    // Solo realiza la llamada API si el usuario no está ya establecido
    if (!user) {
      axios.get('/profile')
        .then(({ data }) => {
          setUser(data);    // Establece el usuario obtenido de la API
          setReady(true);   // Indica que el estado está listo para ser consumido
        })
        .catch(error => {
          console.error("Error loading user profile:", error);
          setReady(true);   // Asegúrate de marcar ready incluso en caso de error
        });
    }
  }, []); // Dependencias vacías para ejecutar solo en el montaje

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}