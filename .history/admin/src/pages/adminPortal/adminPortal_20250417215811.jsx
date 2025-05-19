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
    }, [vista, fechaSeleccionada]);
  
    return (
        <div className="list bg-gray-100 min-h-screen">
          <Sidebar />
          <div className="listContainer">
            <Navbar />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      
              {/* Filtros */}
              <div className="bg-white p-4 rounded-2xl shadow col-span-full flex flex-wrap items-center gap-4">
                <label className="font-semibold">Ver por:</label>
                <select
                  className="border rounded px-3 py-2"
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
                    className="border rounded px-3 py-2"
                    value={fechaSeleccionada}
                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                  />
                )}
              </div>
      
              {/* Gráfico de reservas por tiempo */}
              <div className="bg-white rounded-2xl p-4 shadow">
                <h2 className="text-lg font-semibold mb-4">Reservas en el tiempo</h2>
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
              </div>
      
              {/* Tabla de reservas por tiempo */}
              <div className="bg-white rounded-2xl p-4 shadow">
                <h2 className="text-lg font-semibold mb-4">Detalle de Reservas</h2>
                <table className="w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Fecha</th>
                      <th className="border px-4 py-2">Cabañas</th>
                      <th className="border px-4 py-2">Carpas</th>
                      <th className="border px-4 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservasPorMes.map((item) => (
                      <tr key={item.fecha}>
                        <td className="border px-4 py-2">{item.fecha}</td>
                        <td className="border px-4 py-2">{item.cabañas}</td>
                        <td className="border px-4 py-2">{item.carpas}</td>
                        <td className="border px-4 py-2">{item.cabañas + item.carpas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
      
              {/* Ranking por cabaña */}
              <div className="bg-white rounded-2xl p-4 shadow">
                <h2 className="text-lg font-semibold mb-4">Ranking de Reservas por Cabaña</h2>
                <table className="w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Ranking</th>
                      <th className="border px-4 py-2">Cabaña</th>
                      <th className="border px-4 py-2">Reservas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservasPorCabaña.map((item, index) => (
                      <tr key={item._id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{item._id}</td>
                        <td className="border px-4 py-2">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
      
              {/* Promedio de huéspedes */}
              <div className="bg-white rounded-2xl p-6 shadow flex flex-col justify-center items-center">
                <h2 className="text-lg font-semibold mb-2">Promedio de Huéspedes por Reserva</h2>
                <p className="text-gray-600">Cabañas: {promedioHuespedes.avgGuestsLodges?.toFixed(2)}</p>
                <p className="text-gray-600">Carpas: {promedioHuespedes.avgGuestsTents?.toFixed(2)}</p>
              </div>
      
              {/* Promedio de estadía */}
              <div className="bg-white rounded-2xl p-6 shadow flex flex-col justify-center items-center">
                <h2 className="text-lg font-semibold mb-2">Duración Promedio de Estadía</h2>
                <p className="text-gray-600">Cabañas: {promedioEstadias.avgStayLodges?.toFixed(2)} días</p>
                <p className="text-gray-600">Carpas: {promedioEstadias.avgStayTents?.toFixed(2)} días</p>
              </div>
      
            </div>
          </div>
        </div>
      );
      
  };
  
  export default Single;
  