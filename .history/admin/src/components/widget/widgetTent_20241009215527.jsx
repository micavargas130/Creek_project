import "./widget.scss";

const widgetTent = ({ tentCount }) => {
  return (
    <div className="widget">
      <div className="left">
        <span className="title">Carpas</span>
        <span className="counter">{tentCount}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
        
        </div>
      </div>
    </div>
  );
};

export default widgetTent;