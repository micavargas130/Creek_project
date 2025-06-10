
import React, { useState } from "react";
import "./widget.scss";
import HouseSidingRoundedIcon from "@mui/icons-material/HouseSidingRounded";
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
            backgroundColor: "rgb(236, 198, 7)", // Azul translúcido
            color: "rgba(240, 170, 8, 0.99)",
            borderRadius: "50%",
            padding: "5px",
            fontSize: "30px",
          }}
        />
      ),
    },
  ];
  const current = widgets[currentWidget];

  return (
    <div className="widget combinedWidget">
      <div className="left">
        <span className="title">{current.title}     {current.icon && current.icon}</span> 
        <span className="counter">{current.counter}</span>
        {current.details && <small>{current.details}</small>}
      </div>
    </div>
  );
};

export default CombinedWidget;