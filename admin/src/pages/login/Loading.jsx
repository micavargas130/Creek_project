import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Loading = () => {
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