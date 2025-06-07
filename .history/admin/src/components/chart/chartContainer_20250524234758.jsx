import { useState } from "react";
import Chart from "../../components/chart/ChartAccounting.jsx";
import ChartIncomeExpense from "../../components/chart/BarGraph.jsx";
import IncomeByServiceChart from "../../components/chart/PieChart.jsx";
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
          const filteredRawData = rawData.filter((entry) => {
            if (entry.type !== "Ingreso") return false;
        
            const entryDate = new Date(entry.date);
            const yearMatch = entryDate.getFullYear() === selectedYear;
            const monthMatch = selectedMonth === "" || entryDate.getMonth() === Number(selectedMonth);
        
            return yearMatch && monthMatch;
          });
        
          return <IncomeByServiceChart data={filteredRawData} />;
        case "widgets":
          return <WidgetsContainer totalMoney={totalMoney} totalIncome={totalIncome} totalExpense={totalExpense} showOccupationWidgets={false} />;
        default:
          return null;
      }
    };
  
  return (
    <div className="chartTabsContainer">
      <div className="tabButtons">
        <div className="filterControls">
          <div></div>
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
        <button onClick={() => setActiveTab("evolucion")}>Evolución</button>
        <button onClick={() => setActiveTab("ingresosEgresos")}>Ingresos vs Egresos</button>
        <button onClick={() => setActiveTab("ingresosServicios")}>Ingresos por Servicio</button>
        <button onClick={() => setActiveTab("widgets")}>Resumen</button>
      </div>
      <div className="chartContent">{renderChart()}</div>
    </div>
  );
};

export default ChartContainer;
