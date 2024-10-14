import { BarChart, BarSeries, XAxis } from '@mui/x-charts';

const BarGraph = ({ totalIncome, totalExpense, totalMoney }) => {
  return (
    <BarChart
      aria-label="Contabilidad"
      width={500} // Ancho del gráfico
      height={300} // Alto del gráfico
      data={[
        { type: 'Ingresos', amount: totalIncome },
        { type: 'Egresos', amount: totalExpense },
        { type: 'Total', amount: totalMoney }
      ]}
    >
      <XAxis orientation="bottom" tickFormat={(value) => value} />
      <BarSeries
        name="Cantidad"
        valueField="amount"
        argumentField="type"
        color={(seriesName) => {
          if (seriesName === 'Ingresos') {
            return '#4caf50'; // Color para los ingresos
          } else if (seriesName === 'Egresos') {
            return '#f44336'; // Color para los egresos
          } else {
            return '#2196f3'; // Color para el total
          }
        }}
      />
    </BarChart>
  );
};

export default BarGraph;