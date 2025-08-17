import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ChartIncomeExpense = ({ data }) => {
  return (
    <div className="chart">
      <h3 className="chartTitle">Ingresos vs Egresos</h3>
      <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={data}
    margin={{ top: 20, right: 30, left: 120, bottom: 5 }} 
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis
      width={30} 
      tickFormatter={(value) =>
        value.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      }
    />
    <Tooltip
      formatter={(value) =>
        `$${value.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      }
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