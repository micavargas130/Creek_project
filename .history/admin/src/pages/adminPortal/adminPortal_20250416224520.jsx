import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, ResponsiveContainer
  } from 'recharts';
import axiosInstance from "../../axios/axiosInstance.js"
import { useEffect, useState } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
  

const Single = () => {
    const [reservasPorMes, setReservasPorMes] = useState([]);
    const [reservasPorCabaña, setReservasPorCabaña] = useState([]);
    const [promedioHuespedes, setPromedioHuespedes] = useState({});
    const [promedioEstadias, setPromedioEstadias] = useState({});
    const [vista, setVista] = useState("mes");
    const [fechaSeleccionada, setFechaSeleccionada] = useState("");


  
    useEffect(() => {
        const fetchData = async () => {
          try {
            const res1 = await axiosInstance.get("/graphs/reservas-tiempo", {
                params: { vista, fecha: fechaSeleccionada }
              });
                          const res2 = await axiosInstance.get("/graphs/reservas-cabana");
            const res3 = await axiosInstance.get("/graphs/promedio-huespedes");
            const res4 = await axiosInstance.get("/graphs/promedio-estadia");
      
            const lodges = res1.data.bookings;
            const tents = res1.data.tents;
      
            const agrupado = {};
      
            // Clave para agrupar: depende de la vista
            const getKey = (item) => {
              const { year, month, day } = item._id;
              if (vista === "mes") return `${year}-${month}`;
              if (vista === "dia") return `${year}-${month}-${day}`;
              if (vista === "año") return `${year}`;
            };
      
            lodges.forEach(item => {
              const key = getKey(item);
              if (!agrupado[key]) agrupado[key] = { fecha: key, cabañas: 0, carpas: 0 };
              agrupado[key].cabañas += item.total;
            });
      
            tents.forEach(item => {
              const key = getKey(item);
              if (!agrupado[key]) agrupado[key] = { fecha: key, cabañas: 0, carpas: 0 };
              agrupado[key].carpas += item.total;
            });
      
            const formateado = Object.values(agrupado).sort((a, b) => a.fecha.localeCompare(b.fecha));
      
            setReservasPorMes(formateado);
            setReservasPorCabaña(res2.data);
            setPromedioHuespedes(res3.data);
            setPromedioEstadias(res4.data);
          } catch (err) {
            console.error("Error al cargar estadísticas", err);
          }
        };
      
        fetchData();
      }, [vista, fechaSeleccionada]); // <- importante: vuelve a ejecutar al cambiar la vista
        
    return (

    <div className="list">
        <Sidebar/>
        <div className="listContainer">
          <Navbar/>        
          <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-2">
  <label className="font-semibold">Ver por:</label>
  <select
    className="border rounded px-2 py-1"
    value={vista}
    onChange={(e) => setVista(e.target.value)}
  >
    <option value="mes">Mes</option>
    <option value="dia">Día</option>
    <option value="año">Año</option>
  </select>
  {vista === "dia" && (
    <input
      type="date"
      className="border rounded px-2 py-1"
      value={fechaSeleccionada}
      onChange={(e) => setFechaSeleccionada(e.target.value)}
    />
  )}
</div>
</div>



</div>

  
        {/* Gráfico de reservas por mes */}
        <ResponsiveContainer width="100%" height={250}>
  <LineChart data={reservasPorMes}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="fecha" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="cabañas" stroke="#8884d8" name="Cabañas" />
    <Line type="monotone" dataKey="carpas" stroke="#82ca9d" name="Carpas" />
  </LineChart>
</ResponsiveContainer>


  
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
      </div>
      </div>
    );
  };
  
  export default Single;
  