import { useState } from "react";
import Chart from "../../components/chart/ChartAccounting.jsx";
import ChartIncomeExpense from "../../components/chart/BarGraph.jsx";
import IncomeByServiceChart from "../../components/chart/PieChart.jsx";
import SeasonalAnalysisChart from "../../components/chart/analisisChart.jsx";
import WidgetsContainer from "../../components/widget/widgetContainer";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useEffect } from "react";
import axiosInstance from "../../axios/axiosInstance.js"


const ChartContainer = ({ rawData, processedData, chartData, totalMoney, totalIncome, totalExpense }) => {
    const [activeTab, setActiveTab] = useState("evolucion");
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [evolutionData, setEvolutionData] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get(`/graphs/evolution?year=${selectedYear}&month=${selectedMonth}`);
      setEvolutionData(res.data);
    } catch (err) {
      console.error("Error al obtener datos de evolución:", err);
    }
  };

  fetchData();
}, [selectedYear, selectedMonth]);


    const renderChart = () => {
      switch (activeTab) {
        case "evolucion":
       return <Chart aspect={4 / 1} title="Evolución del Dinero" data={evolutionData} selectedYear={selectedYear} selectedMonth={selectedMonth}/>;
        case "ingresosEgresos":
          const incomeExpenseData = evolutionData.map(item => ({
            month: item.name,
            income: item.ingresos,
            expense: item.egresos, }));
        return <ChartIncomeExpense data={incomeExpenseData} />;
        case "ingresosServicios":
          return <IncomeByServiceChart data={rawData} />;
        case "analisisEstacional":
          return <SeasonalAnalysisChart bookings={rawData} />;
        case "widgets":
          return <WidgetsContainer totalMoney={totalMoney} totalIncome={totalIncome} totalExpense={totalExpense} showOccupationWidgets={false} />;
        default:
          return null;
      }
    };
  
  return (
    <div className="chartTabsContainer">
      <div className="filterControls">
  <FormControl sx={{ m: 1, minWidth: 120 }}>
    <InputLabel>Año</InputLabel>
    <Select
      value={selectedYear}
      onChange={(e) => setSelectedYear(Number(e.target.value))}
      label="Año"
    >
      {[2025, 2024, 2023].map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl sx={{ m: 1, minWidth: 120 }}>
    <InputLabel>Mes</InputLabel>
    <Select
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
      label="Mes"
    >
      <MenuItem value="">Todo el año</MenuItem>
      {[
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ].map((name, index) => (
        <MenuItem key={index} value={index}>
          {name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</div>
      <div className="tabButtons">
        <button onClick={() => setActiveTab("evolucion")}>Evolución</button>
        <button onClick={() => setActiveTab("ingresosEgresos")}>Ingresos vs Egresos</button>
        <button onClick={() => setActiveTab("ingresosServicios")}>Ingresos por Servicio</button>
        <button onClick={() => setActiveTab("analisisEstacional")}>Análisis Estacional</button>
        <button onClick={() => setActiveTab("widgets")}>Resumen</button>
      </div>
      <div className="chartContent">{renderChart()}</div>
    </div>
  );
};

export default ChartContainer;
