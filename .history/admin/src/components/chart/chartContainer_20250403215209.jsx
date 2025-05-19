import { useState } from "react";
import Chart from "../../components/chart/ChartAccounting.jsx";
import ChartIncomeExpense from "../../components/chart/BarGraph.jsx";
import IncomeByServiceChart from "../../components/chart/PieChart.jsx";
import SeasonalAnalysisChart from "../../components/chart/analisisChart.jsx";
import WidgetsContainer from "../../components/widget/widgetContainer";

const ChartContainer = ({ data, chartData, totalMoney, totalIncome, totalExpense }) => {
  const [activeTab, setActiveTab] = useState("evolucion");

  const renderChart = () => {
    switch (activeTab) {
      case "evolucion":
        return <Chart aspect={4 / 1} title="Evolución del Dinero" data={data} />;
      case "ingresosEgresos":
        return <ChartIncomeExpense data={chartData} />;
      case "ingresosServicios":
        return <IncomeByServiceChart data={data} />;
      case "analisisEstacional":
        return <SeasonalAnalysisChart bookings={data} />;
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
