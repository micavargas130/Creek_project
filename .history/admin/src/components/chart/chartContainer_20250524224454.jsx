import { useState } from "react";
import Chart from "../../components/chart/ChartAccounting.jsx";
import ChartIncomeExpense from "../../components/chart/BarGraph.jsx";
import IncomeByServiceChart from "../../components/chart/PieChart.jsx";
import SeasonalAnalysisChart from "../../components/chart/analisisChart.jsx";
import WidgetsContainer from "../../components/widget/widgetContainer";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useEffect } from "react";

const ChartContainer = ({ rawData, processedData, chartData, totalMoney, totalIncome, totalExpense }) => {
    const [activeTab, setActiveTab] = useState("evolucion");
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState("");

    
useEffect(() => {
  // Este efecto puede servir para volver a cargar los datos desde el backend si hicieras una consulta con año/mes
  // fetchData(selectedYear, selectedMonth);
}, [selectedYear, selectedMonth]);


    const renderChart = () => {
      switch (activeTab) {
        case "evolucion":
          return <Chart aspect={4 / 1} title="Evolución del Dinero" data={processedData} />;
        case "ingresosEgresos":
          return <ChartIncomeExpense data={chartData} />;
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
