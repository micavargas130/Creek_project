import React from "react";
import Widget from "../../components/widget/WidgetAccounting";


const WidgetsContainer = ({ totalMoney, totalIncome, totalExpense }) => {
  const [filteredData, setFilteredData] = useState({ totalMoney, totalIncome, totalExpense });

  const fetchDataBasedOnFilter = async (type, filter) => {
    try {
      // Envía una solicitud al backend con el filtro correspondiente
      const response = await axios.get(`/accounting?filter=${filter}`);
      
      // Devuelve los datos actualizados basados en el tipo de widget
      if (type === "totalMoney") {
        return response.data.totalMoney; // Ajusta esto según tu respuesta del backend
      } else if (type === "totalIncome") {
        return response.data.totalIncome;
      } else if (type === "totalExpense") {
        return response.data.totalExpense;
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      return 0; // Devuelve un valor por defecto en caso de error
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