import "./widget.scss";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";

const OccupationWidget = ({ occupiedLodges, totalLodges, occupiedTents, totalTents }) => {
  const totalUnits = totalLodges + totalTents;
  const totalOccupied = occupiedLodges + occupiedTents;
  const occupationPercentage = totalUnits > 0 ? ((totalOccupied / totalUnits) * 100).toFixed(2) : 0;

  return (
    <div className="widget">
      <div className="left">
        <span className="title">Ocupación del Camping</span>
        <span className="counter">{occupationPercentage}%</span>
        <span className="details">{totalOccupied} de {totalUnits} unidades ocupadas</span>
      </div>
      <div className="right">
        <AutoGraphIcon
          className="icon"
          style={{
            backgroundColor: "rgba(25, 244, 47, 0.47)",
            color: "rgba(6, 104, 35, 0.79)",
            borderRadius: "50%",
            padding: "5px",
            fontSize: "30px"
          }}
        />
      </div>
    </div>
  );
};

export default OccupationWidget;
