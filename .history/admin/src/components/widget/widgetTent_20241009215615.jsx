import "./widget.scss";

const widgetTent = ({ count }) => {
  return (
    <div className="widget">
      <div className="left">
        <span className="title">Carpas</span>
        <span className="counter">{count}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
        
        </div>
      </div>
    </div>
  );
};

export default widgetTent;