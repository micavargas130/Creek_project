import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
  import axiosInstance from "../../axios/axiosInstance.js"
  import { useEffect, useState } from 'react';
  import Sidebar from "../../components/sidebar/Sidebar";
  import Navbar from "../../components/navbar/Navbar";
  import { Box, Typography, FormControl, Select, MenuItem, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

  const Single = () => {
    const [reservasPorMes, setReservasPorMes] = useState([]);
    const [reservasPorCabaña, setReservasPorCabaña] = useState([]);
    const [promedioHuespedes, setPromedioHuespedes] = useState({});
    const [promedioEstadias, setPromedioEstadias] = useState({});
    const [vista, setVista] = useState("mes");
    const [fechaSeleccionada, setFechaSeleccionada] = useState("");
    const [mesRanking, setMesRanking] = useState(new Date().getMonth() + 1); // De 1 a 12
    const [añoRanking, setAñoRanking] = useState(new Date().getFullYear());
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          let fechaFormateada = fechaSeleccionada;
          if (vista === "mes" && fechaSeleccionada) {
            // El input devuelve "YYYY-MM", agregamos "-01" para convertirlo en una fecha válida
            fechaFormateada = `${fechaSeleccionada}-01`;
          } 
          const res1 = await axiosInstance.get("/graphs/reservas-tiempo", {
            params: { vista, fecha: fechaFormateada }
          });
          let res2;
          if (mesRanking && añoRanking) {
            res2 = await axiosInstance.get("/graphs/reservas-cabana", {
              params: { año: añoRanking, mes: mesRanking }
            });
          } else {
            res2 = await axiosInstance.get("/graphs/reservas-cabana");
          }
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
  
          const formateado = Object.values(agrupado).sort((a, b) => b.fecha.localeCompare(a.fecha));
          const limitado = formateado.slice(0, 6);
          const limitadoOrdenado = limitado.sort((a, b) => a.fecha.localeCompare(b.fecha));
          
          setReservasPorMes(limitadoOrdenado); 
          setReservasPorMes(limitado);
          setReservasPorCabaña(res2.data);
          setPromedioHuespedes(res3.data);
          setPromedioEstadias(res4.data);
          
        } catch (err) {
          console.error("Error al cargar estadísticas", err);
        }
      };
  
      fetchData();
    }, [vista, fechaSeleccionada,  añg, mesRanking, añoRanking]);

    // Estructura de datos para ambos gráficos
const dataPromedioHuespedes = [
    { tipo: "Cabañas", promedio: promedioHuespedes.avgGuestsLodges },
    { tipo: "Carpas", promedio: promedioHuespedes.avgGuestsTents },
  ];
  
  const dataPromedioEstadias = [
    { tipo: "Cabañas", promedio: promedioEstadias.avgStayLodges },
    { tipo: "Carpas", promedio: promedioEstadias.avgStayTents },
  ];
  
return (
  <div className="new">
    <Sidebar />
      <Navbar />
      <Box sx={{ p: 3, display: 'grid', gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
        
        {/* Filtros */}
        <Paper sx={{ p: 2, gridColumn: "1 / -1", display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <Typography variant="h6" gutterBottom>Reservas en el tiempo</Typography>

          <Typography variant="subtitle1" fontWeight="bold">Ver por:</Typography>
          <FormControl size="small">
            <InputLabel id="vista-label">Vista</InputLabel>
            <Select
              labelId="vista-label"
              value={vista}
              label="Vista"
              onChange={(e) => setVista(e.target.value)}
            >
              <MenuItem value="mes">Mes</MenuItem>
              <MenuItem value="dia">Día</MenuItem>
              <MenuItem value="año">Año</MenuItem>
            </Select>
          </FormControl>
          {vista === "mes" && (
             <input
               type="month"
               value={fechaSeleccionada}
               onChange={(e) => setFechaSeleccionada(e.target.value)}
             />
          )}

          {vista === "dia" && (
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
          )}
        
        {/* Gráfico de reservas por tiempo */}
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
       
        {/* Tabla de reservas por tiempo */}
          <Typography variant="h6" gutterBottom>Detalle de Reservas</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cabañas</TableCell>
                  <TableCell>Carpas</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservasPorMes.map((item) => (
                  <TableRow key={item.fecha}>
                    <TableCell>{item.fecha}</TableCell>
                    <TableCell>{item.cabañas}</TableCell>
                    <TableCell>{item.carpas}</TableCell>
                    <TableCell>{item.cabañas + item.carpas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
  
        {/* Ranking por cabaña */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
           <Typography variant="subtitle1">Filtrar por mes:</Typography>
           <FormControl size="small">
             <Select
               value={mesRanking}
               onChange={(e) => {
                 setMesRanking(e.target.value);
               }}
             >
               {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                 <MenuItem key={mes} value={mes}>
                   {new Date(0, mes - 1).toLocaleString('default', { month: 'long' })}
                 </MenuItem>
               ))}
             </Select>
           </FormControl>
         
           <Typography variant="subtitle1">Año:</Typography>
           <FormControl size="small">
             <Select
               value={añoRanking}
               onChange={(e) => {
                 setAñoRanking(e.target.value);
               }}
             >
               {[2023, 2024, 2025].map((año) => (
                 <MenuItem key={año} value={año}>{año}</MenuItem>
               ))}
             </Select>
           </FormControl>
         </Box>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Promedio de Huéspedes por Reserva</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataPromedioHuespedes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="promedio" fill="#8884d8" name="Promedio de Huéspedes" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Duración Promedio de Estadía</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataPromedioEstadias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="promedio" fill="#82ca9d" name="Días de Estadía" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </div>
    );
  };
  export default Single;
  