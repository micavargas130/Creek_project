import React from "react";
import "./BarGraph.css";

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
    const xAxisLabels = [];
    for (let i = 0; i < data.length; i++) {
      xAxisLabels.push(
        <div key={i} className="x-axis-label">
          {data[i].label}
        </div>
      );
    }
    return xAxisLabels;
  };

  // Función para generar las barras del gráfico
  const renderBars = () => {
    // Obtener el valor máximo para normalizar la altura de las barras
    let maxBarValue = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].value > maxBarValue) {
        maxBarValue = data[i].value;
      }
    }

    const bars = [];
    for (let i = 0; i < data.length; i++) {
      bars.push(
        <div key={i} className="bar" style={getBarStyle(data[i].value, maxBarValue, data[i].color)}>
          <div className="bar-label">{data[i].value}</div>
        </div>
      );
    }
    return bars;
  };

  return (
    <div className="bar-chart">
      <div className="x-axis">{renderXAxisLabels()}</div>
      <div className="bars">{renderBars()}</div>
    </div>
  );
};

export default BarChart;

