// components/widget/LodgeWidget.jsx
import "./widget.scss";
import HouseSidingRoundedIcon from '@mui/icons-material/HouseSidingRounded';

const widgetLodges = ({ occupiedCount }) => {
  const data = {
    title: "Cabañas Ocupadas",
    counter: `${occupiedCount}`,
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
          <span className="title">{data.title}</span>
          <span className="counter">{data.counter}</span>
          <span className="link">{data.link}</span>
        </div>
        <div className="right">{data.icon}</div>
      </div>
    );
};

export default widgetLodges;
