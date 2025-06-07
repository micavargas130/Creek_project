import "./widget.scss";
import FestivalRoundedIcon from "@mui/icons-material/FestivalRounded";

const WidgetTent = ({ count }) => {
  return (
    <div className="widget">
      <div className="left">
        <span className="title">Carpas Ocupadas</span>
        <span className="counter">{count}</span>
      </div>
      <div className="right">
        <FestivalRoundedIcon
          className="icon"
          style={{
            backgroundColor: "rgba(52, 161, 194, 0.2)", // Azul translúcido
            color: "rgba(17, 27, 131, 0.66)",
            borderRadius: "50%",
            padding: "5px",
            fontSize: "30px",
          }}
        />
      </div>
    </div>
  );
};

export default WidgetTent;
