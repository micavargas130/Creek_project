import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const IncomeByServiceChart = ({ data }) => {
  // Procesar los datos para agrupar ingresos por tipo de servicio
  const processedData = data.reduce((acc, entry) => {
    if (entry.type === "Ingreso") {
      const service = entry.serviceType || "Otros";
      if (!acc[service]) {
        acc[service] = 0;
      }
      acc[service] += entry.amount;
    }
    return acc;
  }, {});

  // Convertir en formato compatible con Recharts
  const chartData = Object.keys(processedData).map((key) => ({
    name: key,
    value: processedData[key],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
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
    </ResponsiveContainer>
  );
};

export default IncomeByServiceChart;
