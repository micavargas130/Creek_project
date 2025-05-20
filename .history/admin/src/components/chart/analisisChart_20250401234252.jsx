import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const processSeasonalData = (bookings) => {
    const totalUnits = 58; // Cantidad total de cabañas/carpas disponibles
  
    // Inicializar estructura de datos para los 12 meses
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("es", { month: "short" }),
      reservations: 0,
      occupiedDays: 0, // Para calcular ocupación real
    }));
  
    if (!bookings || bookings.length === 0) {
      console.warn("No hay datos de reservas disponibles.");
      return months;
    }
  
    bookings.forEach((booking) => {
        console.log("bookingGr", booking.checkIn)
      if (!booking.checkIn || !booking.checkOut) return;
  
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      
      let currentDate = new Date(checkIn);
      while (currentDate <= checkOut) {
        const monthIndex = currentDate.getMonth();
        if (monthIndex >= 0 && monthIndex <= 11) {
          months[monthIndex].reservations++;
          months[monthIndex].occupiedDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  
    // Calcular porcentaje de ocupación
    months.forEach((month, index) => {
      const daysInMonth = new Date(new Date().getFullYear(), index + 1, 0).getDate();
      month.occupancy = ((month.occupiedDays / (totalUnits * daysInMonth)) * 100).toFixed(2);
    });
  
    console.log("Datos procesados:", months);
    return months;
  };
  

const SeasonalAnalysisChart = ({ bookings }) => {
    const data = processSeasonalData(bookings);
    console.log("data",data);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reservations" stroke="#8884d8" name="Reservas" />
                <Line type="monotone" dataKey="occupancy" stroke="#82ca9d" name="Ocupación (%)" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SeasonalAnalysisChart;