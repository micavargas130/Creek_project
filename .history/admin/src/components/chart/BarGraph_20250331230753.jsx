import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const IncomeVsExpensesChart = ({ data }) => {
  // Procesar datos para agrupar ingresos y egresos por mes
  const processedData = data.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleString("default", { month: "short" });
    if (!acc[month]) {
      acc[month] = { name: month, Ingresos: 0, Egresos: 0 };
    }
    if (entry.type === "Ingreso") {
      acc[month].Ingresos += entry.amount;
    } else if (entry.type === "Egreso") {
      acc[month].Egresos += entry.amount;
    }
    return acc;
  }, {});

  const chartData = Object.values(processedData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Ingresos" fill="#4CAF50" />
        <Bar dataKey="Egresos" fill="#F44336" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default IncomeVsExpensesChart;
