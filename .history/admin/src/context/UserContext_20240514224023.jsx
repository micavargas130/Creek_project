import { createContext, useEffect, useReducer } from "react";
import axios from "axios";

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
  const [loading, setLoading] = useStat(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/profile");
        dispatchUser({ type: "SET_USER", payload: response.data });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        dispatchUser({ type: "CLEAR_USER" });
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post("/login", credentials);
      dispatchUser({ type: "SET_USER", payload: res.data });
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/logout");
      dispatchUser({ type: "CLEAR_USER" });
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
