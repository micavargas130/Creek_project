// OccupationWidget.jsx
import React from "react";
import "./widget.scss";

const OccupationWidget = ({ occupiedLodges, totalLodges, occupiedTents, totalTents }) => {
  const totalOccupied = occupiedLodges + occupiedTents;
  const totalUnits = totalLodges + totalTents;
  const occupationPercentage = totalUnits > 0 ? ((totalOccupied / totalUnits) * 100).toFixed(2) : 0;

  return (
    <div className="widget">
      <h3>Ocupación del Camping</h3>
      <p>{occupationPercentage}%</p>
      <small>{totalOccupied} de {totalUnits} unidades ocupadas</small>
    </div>
  );
};

export default OccupationWidget;