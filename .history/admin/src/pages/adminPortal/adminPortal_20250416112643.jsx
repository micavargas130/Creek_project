import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, ResponsiveContainer
  } from 'recharts';
  import axios from 'axios';
  import { useEffect, useState } from 'react';
  

const Single = () => {

    const [reservasPorMes, setReservasPorMes] = useState([]);
const [reservasPorCabaña, setReservasPorCabaña] = useState([]);
const [promedioHuespedes, setPromedioHuespedes] = useState({});
const [promedioEstadias, setPromedioEstadias] = useState({});

useEffect(() => {
  const fetchData = async () => {
    try {
      const res1 = await axios.get("/api/stats/reservas-tiempo");
      const res2 = await axios.get("/api/stats/reservas-cabana");
      const res3 = await axios.get("/api/stats/promedio-huespedes");
      const res4 = await axios.get("/api/stats/promedio-estadia");

      // Combinar reservas de carpas y cabañas
      const meses = [...res1.data.bookings, ...res1.data.tents];
      const agrupado = {};

      meses.forEach(item => {
        const key = `${item._id.year}-${item._id.month}`;
        agrupado[key] = (agrupado[key] || 0) + item.total;
      });

      const formateado = Object.entries(agrupado).map(([key, total]) => ({
        mes: key,
        total
      }));

      setReservasPorMes(formateado);
      setReservasPorCabaña(res2.data);
      setPromedioHuespedes(res3.data);
      setPromedioEstadias(res4.data);
    } catch (err) {
      console.error("Error al cargar estadísticas", err);
    }
  };

  fetchData();
}, []);



}

export default Single;