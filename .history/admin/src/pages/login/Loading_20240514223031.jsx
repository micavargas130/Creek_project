import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { faWindowRestore } from "@fortawesome/free-solid-svg-icons";

const Loading = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useStat(false);

  useEffect(() => {
    if (!hasRedirected) {
      window.location.reload()
      setHasRedirected(true);
      navigate("/");
    }
  }, []);


  return <div>Loading...</div>;
};

export default Loading;