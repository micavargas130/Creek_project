import "./widget.scss";

import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const Widget = ({ type, totalMoney, totalIncome, totalExpense }) => {
  let data;

  switch (type) {
    case "totalMoney":
      data = {
        title: "Total Money",
        counter: `$ ${totalMoney}`,
        link: "View details",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "totalIncome":
      data = {
        title: "Total Income",
        counter: `$ ${totalIncome}`,
        link: "View all orders",
        icon: (
          <ArrowDownwardIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 0, 255, 0.2)", color: "blue" }}
          />
        ),
      };
      break;
    case "totalExpense":
      data = {
        title: "Total Expense",
        counter: `$ ${totalExpense}`,
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(128, 0, 128, 0.2)", color: "purple" }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.counter}</span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
