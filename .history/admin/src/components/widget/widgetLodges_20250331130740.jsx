import React, { useState } from "react";
import "./widget.scss";
import HouseSidingRoundedIcon from "@mui/icons-material/HouseSidingRounded";
import FestivalRoundedIcon from "@mui/icons-material/FestivalRounded";

const CombinedWidget = ({ occupiedLodges, totalLodges, occupiedTents, totalTents, occupationPercentage }) => {
  const [currentWidget, setCurrentWidget] = useState(0); // 0: Cabañas, 1: Carpas, 2: Ocupación

  // Datos para los tres widgets
  const widgets = [
    {
      title: "Cabañas Ocupadas",
      counter: occupiedLodges,
      icon: (
        <HouseSidingRoundedIcon
          className="icon"
          style={{
            backgroundColor: "rgba(255, 165, 0, 0.2)", // Color naranja translúcido
            color: "orange",
          }}
        />
      ),
    },
    {
      title: "Carpas Ocupadas",
      counter: occupiedTents,
      icon: (
        <FestivalRoundedIcon
          className="icon"
          style={{
            backgroundColor: "rgba(255, 165, 0, 0.2)", // Color naranja translúcido
            color: ,
          }}
        />
      ),
    },
    {
      title: "Ocupación del Camping",
      counter: `${occupationPercentage}%`,
      details: `${occupiedLodges + occupiedTents} de ${totalLodges + totalTents} unidades ocupadas`,
    },
  ];

  // Función para cambiar de widget
  const handleNextWidget = () => {
    setCurrentWidget((prev) => (prev + 1) % widgets.length);
  };

  const handlePreviousWidget = () => {
    setCurrentWidget((prev) => (prev - 1 + widgets.length) % widgets.length);
  };

  const current = widgets[currentWidget];

  return (
    <div className="widget combinedWidget">
      <div className="left">
        <span className="title">{current.title}     {current.icon && current.icon}</span> 
        <span className="counter">{current.counter}</span>
        {current.details && <small>{current.details}</small>}
      </div>
      <div className="right">
        <div className="controls">
        <button onClick={handlePreviousWidget}>◀</button>
        <button onClick={handleNextWidget}>▶</button>
      </div>
      </div>
     
    </div>
  );
};

export default CombinedWidget;
