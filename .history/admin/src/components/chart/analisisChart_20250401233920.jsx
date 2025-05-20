import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
        if (!booking.checkIn) return;

        const date = new Date(booking.checkIn);
        const monthIndex = date.getMonth();

        if (monthIndex < 0 || monthIndex > 11) return;

        months[monthIndex].reservations++;

        const daysInMonth = new Date(date.getFullYear(), monthIndex + 1, 0).getDate();
        months[monthIndex].occupancy =
            (months[monthIndex].reservations / (totalUnits * daysInMonth)) * 100;
    });

    return months;
};

const SeasonalAnalysisChart = ({ bookings }) => {
    const data = processSeasonalData(bookings);
    console.log(data);

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