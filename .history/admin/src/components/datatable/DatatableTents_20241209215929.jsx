import React, { useState } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesourceTents.js";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Datatable = () => {
  const { data } = useFetch("/tents");
  const [currentParams, setCurrentParams] = useState(null);
  const navigate = useNavigate();
  const [accountingData, setAccountingData] = useState([]);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState(null);

  const filteredData = data.filter((item) => item.status && item.status.status === "Activa");
  const { tentId } = useParams();



  useEffect(() => {
    const fetchAccountingRecords = async () => {
      try {
        const response = await axios.get("/accounting");
        setAccountingData(response.data); // Guarda los registros de pagos
      } catch (error) {
        console.error("Error al obtener registros de pago:", error);
        setError("Error al obtener registros de pago.");
      }
    };

    fetchAccountingRecords();
  }, []);

   // Combinar información de carpas y pagos
   const tentsWithPaymentStatus = filteredData.map((tent) => {
    const relatedAccounting = accountingData.find(
      (record) => String(record.tent?._id) === String(tent._id)
    );
  

     const status = relatedAccounting?.status?.status?.trim().toLowerCase();
     const isPending = status === "pendiente";
  
    console.log("Tent:", tent._id, "Status:", relatedAccounting?.status?.status);
  
    return {
      ...tent,
      paymentStatus: isPending ? "pendiente" : "pagada",
    };
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

  console.log(accountingData)
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

  const paymentStatusColumn = [
    {
      field: "paymentStats",
      headerName: "Pago",
      width: 100,
      renderCell: (params) => {
        const status = params.row.paymentStatus || "pendiente";
        console.log("estdo", params.row.paymentStatus)
        const icon = status === "pendiente" ? "❗" : "✔"; // (!) para pendiente, ✔ para completo
        return <div className="paymentStatus">{icon} {status}</div>;
      },
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
      <button className="styonClick={addNewButton} className="link">
        Add New
      </button>
      <button onClick={handleHistoricButton}>Historia</button>

      <DataGrid
        className="datagrid"
        rows={tentsWithPaymentStatus}
        columns={[...userColumns, ...guestNumberColumn, ...paymentStatusColumn, ...actionColumn]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
