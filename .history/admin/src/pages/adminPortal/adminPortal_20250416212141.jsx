import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, ResponsiveContainer
  } from 'recharts';
import axiosInstance from "../../axios/axiosInstance.js"
import { useEffect, useState } from 'react';
  

const Single = () => {
    const [reservasPorMes, setReservasPorMes] = useState([]);
    const [reservasPorCabaña, setReservasPorCabaña] = useState([]);
    const [promedioHuespedes, setPromedioHuespedes] = useState({});
    const [promedioEstadias, setPromedioEstadias] = useState({});
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res1 = await axiosInstance.get("/graphs/reservas-tiempo");
          const res2 = await axiosInstance.get("/graphs/reservas-cabana");
          const res3 = await axiosInstance.get("/graphs/promedio-huespedes");
          const res4 = await axiosInstance.get("/graphs/promedio-estadia");
  
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
  
    // 🔥 Aca estaba el problema: ¡faltaba el return!
    return (

    <div className="list">
        <Sidebar/>
        <div className="listContainer">
          <Navbar/>
          <DatatableTents/>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
  
        {/* Gráfico de reservas por mes */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">Reservas por mes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={reservasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
  
        {/* Gráfico de reservas por cabaña */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">Reservas por cabaña</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reservasPorCabaña}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
  
        {/* Promedio de huéspedes */}
        <div className="bg-white rounded-2xl p-4 shadow flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold mb-2">Promedio de huéspedes</h2>
          <p>Cabañas: {promedioHuespedes.avgGuestsLodges?.toFixed(2)}</p>
          <p>Carpas: {promedioHuespedes.avgGuestsTents?.toFixed(2)}</p>
        </div>
  
        {/* Promedio de estadía */}
        <div className="bg-white rounded-2xl p-4 shadow flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold mb-2">Duración promedio de estadía</h2>
          <p>Cabañas: {promedioEstadias.avgStayLodges?.toFixed(2)} días</p>
          <p>Carpas: {promedioEstadias.avgStayTents?.toFixed(2)} días</p>
        </div>
  
      </div>
    );
  };
  
  export default Single;
  