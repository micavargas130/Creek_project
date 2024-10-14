// Datatable.js
import React, { useEffect, useState } from "react";
import "./datatable.scss";
import Chart from "../../components/chart/ChartAccounting.jsx";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Widget from "../../components/widget/WidgetAccounting";
import WidgetsContainer from "../../components/widgets/WidgetsContainer";  // <--- Importa el nuevo componente
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";

// (resto del código)

const Datatable = (props) => {
  const { data, loading, error } = useFetch("/accounting");
  const [selectedParams, setSelectedParams] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("pagada");
  const navigate = useNavigate();

  const totalIncome = getIncomes(data);
  const totalExpense = getExpenses(data);
  const totalMoney = getTotalMoney(data);

  // (resto del código)

  return (
    <div className="datatable">
      <div className="datatableTitle">Contabilidad</div>
      <button onClick={addNewButton} className="link">Add New</button>
      <button onClick={newPricesButton} className="link">Modificar precios</button>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />

      {/* Aquí se muestra el Chart y el nuevo componente WidgetsContainer */}
      <div className="chartsContainer">
        <Chart aspect={4 / 1} title="Evolución del Dinero" data={processDataForChart(data)} />
        <WidgetsContainer totalMoney={totalMoney} totalIncome={totalIncome} totalExpense={totalExpense} />
      </div>
    </div>
  );
};

export default Datatable;
