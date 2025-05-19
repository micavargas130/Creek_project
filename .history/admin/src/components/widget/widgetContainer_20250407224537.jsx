import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios/axiosInstance.js";
import Widget from "../../components/widget/WidgetAccounting";
import CombinedWidget from "../../components/widget/widgetLodges.jsx";

const WidgetsContainer = ({ 
  totalMoney, 
  totalIncome, 
  totalExpense, 
  occupiedLodges, 
  totalLodges, 
  occupiedTents, 
  totalTents, 
  showOccupationWidgets = true 
})  => {
  const [filteredData, setFilteredData] = useState({ totalMoney, totalIncome, totalExpense });

  const fetchDataBasedOnFilter = async (type, filter) => {
    try {
      const response = await axiosInstance.get(`/accounting/filter?filter=${filter}`);
      const data = response.data;

      if (type === "totalMoney") return data.totalMoney || 0;
      if (type === "totalIncome") return data.totalIncome || 0;
      if (type === "totalExpense") return data.totalExpense || 0;
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      return 0;
    }
  };

  const handleFilterChange = async (type, filter) => {
    try {
      const updatedData = await fetchDataBasedOnFilter(type, filter);
      setFilteredData((prev) => ({
        ...prev,
        [type]: updatedData,
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
      {/* Widgets Financieros */}
      <Widget type="totalMoney" totalMoney={filteredData.totalMoney} onFilterChange={handleFilterChange} />
      <Widget type="totalIncome" totalIncome={filteredData.totalIncome} onFilterChange={handleFilterChange} />
      <Widget type="totalExpense" totalExpense={filteredData.totalExpense} onFilterChange={handleFilterChange} /
      
      {/* Solo mostrar el widget de ocupación si showOccupationWidgets es true */}
      {showOccupationWidgets && (
        <CombinedWidget 
          occupiedLodges={occupiedLodges} 
          totalLodges={totalLodges}
          occupiedTents={occupiedTents}
          totalTents={totalTents}
          occupationPercentage={((occupiedLodges + occupiedTents) / (totalLodges + totalTents) * 100).toFixed(2)}
        />
      )}
    </div>
  );
};

export default WidgetsContainer;
