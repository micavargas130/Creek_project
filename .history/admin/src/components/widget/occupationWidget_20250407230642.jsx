// OccupationWidget.jsx
import React from "react";
import "./widget.scss";

const totalUnits = 58;

const OccupationWidget = ({ occupiedLodges, totalLodges, occupiedTents, totalTents }) => {
  const totalOccupied = occupiedLodges + occupiedTents;
  totalCarpas = 58 - totalLodges


  return (
    <div className="widget">
      <h3>Ocupación del Camping</h3>
      <p>{occupationPercentage}%</p>
      <small>{totalOccupied} de {totalUnits} unidades ocupadas</small>
    </div>
  );
};

export default OccupationWidget;