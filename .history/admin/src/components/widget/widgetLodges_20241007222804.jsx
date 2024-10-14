// components/widget/LodgeWidget.jsx
import "./widget.scss";

const widgetLodges = ({ occupiedCount }) => {
  return (
    <div className="widget">
      <div className="left">
        <span className="title">Cabañas Ocupadas</span>
        <span className="counter">{occupiedCount}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          {/* Puedes agregar un ícono o indicador si lo deseas */}
        </div>
      </div>
    </div>
  );
};

export default widgetidget;
