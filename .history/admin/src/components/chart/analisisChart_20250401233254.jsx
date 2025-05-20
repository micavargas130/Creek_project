import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const processSeasonalData = (bookings) => {
    const totalUnits = 58; // Cantidad total de cabañas/carpas disponibles
  
    // Inicializar estructura de datos para los 12 meses
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("es", { month: "short" }),
      reservations: 0,
      occupancy: 0,
    }));
  
    if (!bookings || bookings.length === 0) {
      console.warn("No hay datos de reservas disponibles.");
      return months;
    }
  
    bookings.forEach((booking) => {
      if (!booking.checkIn) return; // Evita errores con datos inválidos
  
      const date = new Date(booking.checkIn);
      const monthIndex = date.getMonth();
  
      if (monthIndex < 0 || monthIndex > 11) return; // Asegurar índice válido
  
      months[monthIndex].reservations++;
  
      // Calcular ocupación mensual
      const daysInMonth = new Date(date.getFullYear(), monthIndex + 1, 0).getDate();
      months[monthIndex].occupancy =
        (months[monthIndex].reservations / (totalUnits * daysInMonth)) * 100;
    });
  
    return months;
  };
  