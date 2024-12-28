import React, { useState } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesourceTents.js";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Datatable = () => {
  const { data } = useFetch("/tents");
  const [currentParams, setCurrentParams] = useState(null);
  const navigate = useNavigate();

  const filteredData = data.filter((item) => item.status && item.status.status === "Activa");
  
  
  
  
  
  
  const confirmFinishClick = async (params) => {
    try {
      const tentId = params.row._id;
      const completedStatusId = "668ddd216630f103dda28cde"; 
      await axios.put(`/tents/${tentId}`, {
        status: completedStatusId,
        location: { row: "", col: "" },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error al finalizar:", error);
    }
  };

  const handleCancelClick = async (params) => {
    try {
      const tentId = params.row._id;
      const canceledStatusId = "668ddd316630f103dda28cdf";
      await axios.put(`/tents/${tentId}`, {
        status: canceledStatusId,
        location: { row: "", col: "" },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting tent:", error);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <div className="deleteButton" onClick={() => confirmFinishClick(params)}>Finalizar</div>
          <div className="cancelButton" onClick={() => handleCancelClick(params)}>Cancelar</div>
        </div>
      ),
    },
  ];

  const addNewButton = () => navigate("new");
  const handleHistoricButton = () => navigate("historico");

  const paymentStatusColumn = [
    {
      field: "paymentStatus",
      headerName: "Pago",
      width: 100,
      renderCell: (params) => {
        const status = params.row.paymentStatus || "pendiente";
        const icon = status === "pendiente" || status === "parcial" ? "💲" : "✔";
        return <div className="paymentStatus">{icon} {status}</div>;
      },
    },
  ];

  const guestNumberColumn = [
    {
      field: "guests",
      headerName: "Nro de Huéspedes",
      width: 80,
      renderCell: (params) => {
        const guestsNumber = params.row.numberOfAdults + params.row.numberOfChildren;
        return <div className="clientInfo">{guestsNumber}</div>;
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">Carpas</div>
      <button onClick={addNewButton} className="link">Add New</button>
      <button onClick={handleHistoricButton}>Historia</button>

      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={[...userColumns, ...guestNumberColumn, ...paymentStatusColumn, ...actionColumn]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;