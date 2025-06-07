import React, { useState } from "react";
import "./widget.scss";
import HouseSidingRoundedIcon from "@mui/icons-material/HouseSidingRounded";
import FestivalRoundedIcon from "@mui/icons-material/FestivalRounded";
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

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
  ];
  const current = widgets[currentWidget];

  return (
    <div className="widget combinedWidget">
      <div className="left">
        <span className="title">{current.title}     {current.icon && current.icon}</span> 
        <span className="counter">{current.counter}</span>
        {current.details && <small>{current.details}</small>}
      </div>
      <div className="right">
       
      </div>
     
    </div>
  );
};

export default CombinedWidget;
