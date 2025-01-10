import React from "react";
import Widget from "../../components/widget/WidgetAccounting";


const WidgetsContainer = ({ totalMoney, totalIncome, totalExpense }) => {
  const [filteredData, setFilteredData] = useState({ totalMoney, totalIncome, totalExpense });

  const handleFilterChange = (type, filter) => {
    // Aquí llamas a una función para obtener los datos filtrados según el tipo y el filtro
    const updatedData = fetchDataBasedOnFilter(type, filter); // Implementa esta función
    setFilteredData((prev) => ({
      ...prev,
      [type]: updatedData,
    }));
  };

  return (
    <div className="widgetsContainer">
      <Widget
        type="totalMoney"
        totalMoney={filteredData.totalMoney}
        onFilterChange={handleFilterChange}
      />
      <Widget
        type="totalIncome"
        totalIncome={filteredData.totalIncome}
        onFilterChange={handleFilterChange}
      />
      <Widget
        type="totalExpense"
        totalExpense={filteredData.totalExpense}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};


export default WidgetsContainer;