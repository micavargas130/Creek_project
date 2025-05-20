// src/hooks/useFetch.js
import { useState, useEffect,useCallback} from "react";
import axiosInstance from "../axios/axiosInstance"; // Importar la instancia configurada

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(url);
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;




