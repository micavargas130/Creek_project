import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

const Widget = ({ totalMoney }) => {
  // Temporary data for demonstration
  const diff = 20; // Change in percentage
  const isPositive = diff > 0; // Boolean to determine if the change is positive

  return (
    <div className="widget">
      <div className="left">
        <span className="title">Total Money</span>
        <span className="counter">${totalMoney}</span>
        <span className="link">View details</span>
      </div>
      <div className="right">
        <div className={`percentage ${isPositive ? 'positive' : 'negative'}`}>
          <KeyboardArrowUpIcon />
          {Math.abs(diff)} %
        </div>
        <MonetizationOnOutlinedIcon
          className="icon"
          style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
        />
      </div>
    </div>
  );
};

export default Widget;