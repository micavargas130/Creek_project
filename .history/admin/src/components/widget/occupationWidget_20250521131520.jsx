// OccupationWidget.jsx
import React from "react";
import "./widget.scss";

const totalUnits = 58;

const OccupationWidget = ({ occupiedLodges, totalLodges, occupiedTents, totalTents }) => {
  const totalOccupied = occupiedLodges + occupiedTents;
  const occupationPercentage = totalUnits > 0 ? ((totalOccupied / totalUnits) * 100).toFixed(2) : 0;

  return (
     {
      title: "Ocupación del Camping",
      counter: `${occupationPercentage}%`,
      details: `${occupiedLodges + occupiedTents} de ${totalLodges + totalTents} unidades ocupadas`,
      icon: (
        <AutoGraphIcon
          className="icon"
          style={{
            backgroundColor: "rgba(25, 244, 47, 0.47)", // Color naranja translúcido
            color: "rgba(6, 104, 35, 0.79)" ,
          }}
        />
      ),
    },
  );
};

export default OccupationWidget;