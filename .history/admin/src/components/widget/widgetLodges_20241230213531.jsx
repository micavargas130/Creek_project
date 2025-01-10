// components/widget/LodgeWidget.jsx
import "./widget.scss";


const widgetLodges = ({ occupiedCount }) => {
  const data = {
    title: "Cabañas Ocupadas",
    counter: `${occupiedCount}`,
    link: "Ver detalles",
    icon: (
      <HouseSidingRoundedIcon
        className="icon"
        style={{
          backgroundColor: "rgba(255, 165, 0, 0.2)", // Color naranja translúcido
          color: "orange",
        }}
      />
    ),
  };

  return (
    <div className="widget">
      <div className="left">
        <span className="title">Cabañas Ocupadas</span>
        <span className="counter">{occupiedCount}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
        </div>
      </div>
    </div>
  );
};

export default widgetLodges;
