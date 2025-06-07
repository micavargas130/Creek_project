
import React, { useState } from "react";
import "./widget.scss";
import HouseSidingRoundedIcon from "@mui/icons-material/HouseSidingRounded";


const CombinedWidget = ({ occupiedLodges }) => {

  return (
      <div className="widget">
        <div className="left"></div>
          <span className="title">Carpas Ocupadas</span>
          <span className="counter">{occupiedLodges}</span>
      </div>
      <div className="right">
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
    </div>
    </div>
  );

};

export default CombinedWidget;