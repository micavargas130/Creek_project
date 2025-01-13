import React from "react";
import Widget from "../../components/widget/WidgetAccounting";


// Recibimos las props que necesitan los widgets para trabajar, por ejemplo, totalMoney, totalIncome, totalExpense
const WidgetsContainer = ({ totalMoney, totalIncome, totalExpense }) => {
  return (
    <div className="widgetsContainer">
      <Widget type="totalMoney" totalMoney={totalMoney} />
      <Widget type="totalIncome" totalIncome={totalIncome} />
      <Widget type="totalExpense" totalExpense={totalExpense} />
    </div>
  );
};

export default WidgetsContainer;