
import React, { useState } from "react";
import "./widget.scss";
import HouseSidingRoundedIcon from "@mui/icons-material/HouseSidingRounded";


const CombinedWidget = ({ occupiedLodges }) => {

  return (

     <div className="widget">
      <div className="left"></div>
          <span className="title">Carpas Ocupadas</span>
          <span className="counter">{totalTents}</span>
      </div>
      <div className="right"></div>
        <HouseSidingRoundedIcon
          className="icon"
          style={{
            backgroundColor: "rgba(240, 210, 60, 0.67)", // Azul translúcido
            color: "rgba(240, 170, 8, 0.99)",
            borderRadius: "50%",
            padding: "5px",
            fontSize: "30px",
          }}
        />
      ),
  
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