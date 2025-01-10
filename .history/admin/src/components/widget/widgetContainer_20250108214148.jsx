import React,  { useState} from "react";
import axios from "axios";
import Widget from "../../components/widget/WidgetAccounting";


const WidgetsContainer = ({ totalMoney, totalIncome, totalExpense }) => {
  const [filteredData, setFilteredData] = useState({ totalMoney, totalIncome, totalExpense });

  const fetchDataBasedOnFilter = async (type, filter) => {
    try {
      const response = await axios.get(`/accounting/filter?filter=${filter}`);
      console.log("Money:", response.data);
  
      const data = response.data;
      if (type === "totalMoney") {
        return data.totalMoney || 0;
      } else if (type === "totalIncome") {
        return data.totalIncome || 0;
      } else if (type === "totalExpense") {
        return data.totalExpense || 0;
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      return 0;
    }
  };
  
  
  

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