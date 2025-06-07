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
          const totalIngresos = evolutionData.reduce((sum, item) => sum + item.ingresos, 0);
          const totalEgresos = evolutionData.reduce((sum, item) => sum + item.egresos, 0);
          const incomeExpenseData = [
            {
              month:
                selectedMonth === ""
                  ? "Año Completo"
                  : new Date(2025, selectedMonth).toLocaleString("es-ES", { month: "long" }),
              income: totalIngresos,
              expense: totalEgresos,
            },
          ];
        
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
