import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { faWindowRestore } from "@fortawesome/free-solid-svg-icons";

const Loading = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!hasRedirected) {
      window.location.reload()
      navigate("/");
      setHasRedirected(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Una vez que los datos del usuario estén disponibles, redirige al usuario al inicio
      <div>Loading...</div>;
      navigate("/");
    }
  }, [user, navigate]);

  return <div>Loading...</div>;
};

export default Loading;