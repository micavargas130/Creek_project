import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const IncomeByServiceChart = ({ data }) => {
  console.log("dataS", data)
  // Procesar los datos para agrupar ingresos por tipo de servicio
  const incomeData = data
    .filter(entry => entry.type === "Ingreso") // Filtrar solo ingresos
    .reduce((acc, entry) => {
      let category = "Otros";
      if (entry.lodge) category = "Cabañas";
      else if (entry.tent) category = "Carpas";
      
      acc[category] = (acc[category] || 0) + entry.amount;
      return acc;
    }, {});

    console.log("income", incomeData)

  // Convertir a formato de Recharts
  const chartData = Object.entries(incomeData).map(([name, value]) => ({ name, value }));

  // Colores para cada categoría
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="chartContainer">
      <h3>Ingresos por Tipo de Servicio</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default IncomeByServiceChart;
