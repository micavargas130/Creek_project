import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Loading = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Una vez que los datos del usuario estén disponibles, redirige al usuario al inicio
      navigate("/home");
    }
  }, [user, navigate]);

  return <div>Loading...</div>;
};

export default Loading;