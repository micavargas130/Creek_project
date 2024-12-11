import React, { useState } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesourceTents.js";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Datatable = () => {
  const { data } = useFetch("/tents");
  const [selectedStatus, setSelectedStatus] = useState("pagada");
  const [currentParams, setCurrentParams] = useState(null);
  const navigate = useNavigate();

  const filteredData = data.filter((item) => item.status && item.status.status === "Activa");

  const confirmFinishClick = async () => {


        // Actualizamo el estado de la tienda (tent) a "Completada"
        const tentId = currentParams.row._id;
        const completedStatusId = "668ddd216630f103dda28cde"; // ID del estado "Completada"

        await axios.put(`/tents/${tentId}`, {
            status: completedStatusId,
            location:{row:"", col:""}
        });

        window.location.reload();
    } catch (error) {
        console.error("Error al finalizar:", error);
    } 
};

  const handleCancelClick = async (params) => {
    try {
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
          <div className="deleteButton" onClick={(confirmFinishClick())}>
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

     
    </div>
  );
};

export default Datatable;
