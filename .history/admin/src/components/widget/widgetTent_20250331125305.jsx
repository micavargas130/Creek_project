import "./widget.scss";
import FestivalRoundedIcon from "@mui/icons-material/FestivalRounded";

const widgetTent = ({ count }) => {
  return (
    <div className="widget">
      <div className="left">
        <span className="title">Carpas</span>
        <span className="counter">{count}</span>
      </div>
      <div className="right">
        <FestivalRoundedIcon
          className="icon"
          style={{
            backgroundColor: "rgba(0, 128, 0, 0.2)", // Verde translúcido
            color: "green",
            borderRadius: "50%",
            padding: "5px",
          }}
        />
      </div>
    </div>
  );
};

export default widgetTent;
