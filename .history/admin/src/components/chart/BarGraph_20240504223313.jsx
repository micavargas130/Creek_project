import React from "react";
import "./BarChart.css";

const BarChart = ({ data }) => {
  // Función para determinar la altura de la barra en función del porcentaje
  const getBarHeight = (value, maxValue) => {
    return (value / maxValue) * 100 + "%";
  };

  // Función para generar el estilo de la barra
  const getBarStyle = (value, maxValue, color) => {
    const barHeight = getBarHeight(value, maxValue);
    return {
      height: barHeight,
      backgroundColor: color
    };
  };

  // Función para generar las etiquetas de los ejes X
  const renderXAxisLabels = () => {
    return data.map((item, index) => (
      <div key={index} className="x-axis-label">
        {item.label}
      </div>
    ));
  };

  // Función para generar las barras del gráfico
  const renderBars = () => {
    // Obtener el valor máximo para normalizar la altura de las barras
    const maxBarValue = Math.max(...data.map(item => item.value));
    return data.map((item, index) => (
      <div key={index} className="bar" style={getBarStyle(item.value, maxBarValue, item.color)}>
        <div className="bar-label">{item.value}</div>
      </div>
    ));
  };

  return (
    <div className="bar-chart">
      <div className="x-axis">{renderXAxisLabels()}</div>
      <div className="bars">{renderBars()}</div>
    </div>
  );
};

export default BarChart;
