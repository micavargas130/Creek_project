import React, { useState } from "react";
import "./widget.scss";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const Widget = ({ type, totalMoney, totalIncome, totalExpense, onFilterChange }) => {
  const [filter, setFilter] = useState("all"); // Default filter

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    onFilterChange(type, e.target.value); // Notify parent about the filter change
  };

  let data;

  switch (type) {
    case "totalMoney":
      data = {
        title: " Money",
        counter: `$ ${totalMoney}`,
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
        <select className="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">Todos</option>
          <option value="day">Hoy</option>
          <option value="month">Este mes</option>
          <option value="year">Este año</option>
        </select>
      </div>
      <div className="right">{data.icon}</div>
    </div>
  );
};

export default Widget;
