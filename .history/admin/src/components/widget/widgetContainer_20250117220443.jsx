import React,  { useState, useEffect} from "react";
import axiosInstance from "../../axios/axiosInstance.js"
import Widget from "../../components/widget/WidgetAccounting";


const WidgetsContainer = ({ totalMoney, totalIncome, totalExpense }) => {
  const [filteredData, setFilteredData] = useState({ totalMoney, totalIncome, totalExpense });

  const fetchDataBasedOnFilter = async (type, filter) => {
    try {
      const response = await axiosInstance.get(`/accounting/filter?filter=${filter}`);
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
  
  const handleFilterChange = async (type, filter) => {
    try {
      const updatedData = await fetchDataBasedOnFilter(type, filter); // Espera a que la promesa se resuelva
      setFilteredData((prev) => ({
        ...prev,
        [type]: updatedData, // Actualiza el estado con los datos resueltos
      }));
    } catch (error) {
      console.error("Error updating filtered data:", error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axiosInstance.get(`/accounting/filter?filter=all`);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);
  

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