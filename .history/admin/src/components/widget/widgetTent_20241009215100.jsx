import "./widget.scss";

const widgetLodges = ({ occupiedCount }) => {
  return (
    <div className="widget">
      <div className="left">
        <span className="title">Carpas Ocupadas</span>
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