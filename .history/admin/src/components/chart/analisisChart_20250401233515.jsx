import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SeasonalAnalysisChart = ({ bookings }) => {
  const data = processSeasonalData(bookings);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="reservations" fill="#8884d8" name="Reservas" />
        <Bar dataKey="occupancy" fill="#82ca9d" name="Ocupación (%)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SeasonalAnalysisChart;
