import  { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Loading = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!hasRedirected) {
      setHasRedirected(true);
      navigate("/");
    }
  }, []);


  return <div>Loading...</div>;
};

export default Loading;