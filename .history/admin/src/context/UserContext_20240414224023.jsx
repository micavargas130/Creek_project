import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  ready: false,
  error: null
});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/profile')
      .then(({ data }) => {
        setUser(data);
      })
      .catch(error => {
        console.error("Error loading user profile:", error);
        setError(error);
      })
      .finally(() => {
        setReady(true);
      });
  }, []);

  const value = {
    user,
    setUser,
    ready,
    error
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}