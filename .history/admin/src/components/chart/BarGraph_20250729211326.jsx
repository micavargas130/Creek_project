import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ChartIncomeExpense = ({ data }) => {
  return (
    <div className="chart">
      <h3 className="chartTitle">Ingresos vs Egresos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) => value.toLocaleString("es-AR")}
          />
          <Tooltip
            formatter={(value) => `$${value.toLocaleString("es-AR")}`}
          />
          <Legend />
          <Bar dataKey="income" fill="#4CAF50" name="Ingresos" />
          <Bar dataKey="expense" fill="#F44336" name="Egresos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartIncomeExpense;
