import React from "react";
import Widget from "../../components/widget/WidgetAccounting";
import widgetLodge from "../../components/widget/widgetLodges";

// Recibimos las props que necesitan los widgets para trabajar, por ejemplo, totalMoney, totalIncome, totalExpense
const WidgetsContainer = ({ totalMoney, totalIncome, totalExpense }) => {
  return (
    <div className="widgetsContainer">
      <Widget type="totalMoney" totalMoney={totalMoney} />
      <Widget type="totalIncome" totalIncome={totalIncome} />
      <Widget type="totalExpense" totalExpense={totalExpense} />
      <widget occupiedCount={12} />
    </div>
  );
};

export default WidgetsContainer;