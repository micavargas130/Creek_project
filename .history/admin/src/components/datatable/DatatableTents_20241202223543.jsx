import React, { useState } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesourceTents.js";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import Accounting from '../models/Accounting';
import { useNavigate } from "react-router-dom";

const Datatable = () => {
  const { data } = useFetch("/tents");
  const [currentParams, setCurrentParams] = useState(null);
  const navigate = useNavigate();

  const filteredData = data.filter((item) => item.status && item.status.status === "Activa");

  useEffect(() => {
    try {
        const accountingRecord = axios.get(`accounting/${params.row._id}`);

        if (!accountingRecord) {
            return { message: 'No se encontraron registros de pago para esta tienda' };
        }

        return {
            tentId: tentId,
            paymentStatus: accountingRecord.status ? accountingRecord.status.name : 'Sin estado',
            totalAmount: accountingRecord.totalAmount,
            remainingAmount: accountingRecord.remainingAmount
        };
    } catch (error) {
        console.error('Error al obtener el estado de pago:', error);
        return { error: 'Error al obtener el estado de pago' };
    }
});


  const confirmFinishClick = async (params) => {
    try {
      // Actualizo el estado de tent a "Completada"
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
    try { const tentId = params.row._id;
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
         <div className="deleteButton" onClick={() => confirmFinishClick(params)}>
            Finalizar
          </div>
          <div className="cancelButton" onClick={() => handleCancelClick(params)}>
            Cancelar
          </div>
        </div>
      ),
    },
  ];

  const addNewButton = () => navigate("new");
  const handleHistoricButton = () => navigate("historico");

  const guestNumberColumn = [
    {
      field: "guests",
      headerName: "Nro de Huespedes",
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
      <button onClick={addNewButton} className="link">
        Add New
      </button>
      <button onClick={handleHistoricButton}>Historia</button>

      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={[...userColumns, ...guestNumberColumn, ...actionColumn]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
