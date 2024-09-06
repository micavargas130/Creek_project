import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesourceTents.js";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Datatable = () => {
  const { data, loading, error } = useFetch("/tents");
  const [userInLodge, setUserInLodge] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Pendiente");
  const [currentParams, setCurrentParams] = useState(null);

  const handleOpen = (params) => {
    setCurrentParams(params);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleFinishClick = async () => {
    try {
      const paymentData = {
        amount: currentParams.row.price,
        type: "Ingreso",
        date: new Date(), // Fecha actual
        user: currentParams.row.first_name + " " + currentParams.row.last_name,
        cabain: "Carpa",
        comment: "",
      };

      const newAccountingResponse = await axios.post('/accountings', paymentData);
      const newAccounting = newAccountingResponse.data;

      const newStatus = {
        status: selectedStatus.toLowerCase(), // Convertimos el estado a minúsculas
        accounting: newAccounting._id,
      };

      await axios.post('/paymentStatus', newStatus);

      await axios.put(`tents/${currentParams.row._id}/updateStatusCompleted`);
      window.location.reload();
    } catch (error) {
      console.error("Error al finalizar:", error);
    } finally {
      handleClose();
    }
  };

  const filteredData = data.filter(
    (item) => item.status && item.status.status === "Activa"
  );

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const handleCancelClick = async () => {
          try {
            await axios.put(`tents/${params.row._id}/updateStatusCompleted`);
            window.location.reload();
          } catch (error) {
            console.error("Error deleting tent:", error);
          }
        };

        return (
          <div className="cellAction">
            <div className="deleteButton" onClick={() => handleOpen(params)}>
              Finalizar
            </div>
            <div className="cancelButton" onClick={handleCancelClick}>
              Cancelar
            </div>
          </div>
        );
      },
    },
  ];

  const addNewButton = () => {
    navigate("new");
  };

  const handleHistoricButton = async () => {
    navigate("historico");
  };

  const guestNumberColumn = [
    {
      field: "guests",
      headerName: "Nro de Huespedes",
      width: 150,
      renderCell: (params) => {
        const guestsNumber = params.row.numberOfAdults + params.row.numberOfChildren;
        return <div className="clientInfo">{guestsNumber}</div>;
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">Reservaciones</div>
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

      <div className={`modal ${open ? "open" : ""}`}>
        <div className="modal-content">
          <span className="close" onClick={handleClose}>
            &times;
          </span>
          <h2>Seleccionar estado del pago</h2>
          <select value={selectedStatus} onChange={handleStatusChange}>
            <option value="Pagada">Pagada</option>
            <option value="Parcial">Parcial</option>
            <option value="Pendiente">Pendiente</option>
          </select>
          <button onClick={handleFinishClick}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default Datatable;
