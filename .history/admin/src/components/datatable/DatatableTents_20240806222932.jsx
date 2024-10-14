import React, { useState } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesourceTents.js";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Datatable = () => {
  const { data } = useFetch("/tents");
  const { data: paymentStatuses } = useFetch("/paymentStatuses");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [currentParams, setCurrentParams] = useState(null);
  const navigate = useNavigate();

  const filteredData = data.filter((item) => item.status && item.status.status === "Activa");

  const handleFinishClick = (params) => {
    setCurrentParams(params);
    setModalVisible(true);
  };

  const confirmFinishClick = async () => {
    const statusObj = paymentStatuses.find(status => status.status === selectedStatus.toLowerCase());
    if (!statusObj) {
      alert("Estado de pago no válido.");
      return;
    }

    const paymentData = {
      amount: currentParams.row.price,
      type: "Ingreso",
      date: new Date(),
      user: `${currentParams.row.first_name} ${currentParams.row.last_name}`,
      cabain: "Carpa",
      comment: "",
      status: statusObj._id,
    };

    try {
      await axios.post("/accounting", paymentData);
      await axios.put(`tents/${currentParams.row._id}/updateStatusCompleted`);
      window.location.reload();
    } catch (error) {
      console.error("Error al finalizar:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleCancelClick = async (params) => {
    try {
      await axios.put(`tents/${params.row._id}/updateStatusCompleted`);
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
          <div className="deleteButton" onClick={() => handleFinishClick(params)}>
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

      {modalVisible && (
        <div className="modal">
          <div className="modalContent">
            <h2>Seleccionar estado del pago</h2>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {paymentStatuses.map((status) => (
                <option key={status._id} value={status.status}>
                  {status.status}
                </option>
              ))}
            </select>
            <button onClick={confirmFinishClick}>Confirmar</button>
            <button onClick={() => setModalVisible(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datatable;
