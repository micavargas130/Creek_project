import React, { useState } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesourceTents.js";
import useFetch from "../../hooks/useFetch.js";
import axiosInstance from "../../axios/axiosInstance.js"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import tentsObserver from "../../utils/observers/tentsObserver.js";

const Datatable = () => {
  const { data, refetch } = useFetch("/tents");
  const navigate = useNavigate();
  const [accountingData, setAccountingData] = useState([]);

  const filteredData = data.filter((item) => item.status && item.status.status === "Activa");

  useEffect(() => {
    const handleStatusChange = () => {
      refetch();
    };
  
    tentsObserver.subscribe(handleStatusChange);
   

    const fetchAccountingRecords = async () => {
      try {
        const response = await  axiosInstance.get("/accounting");
        setAccountingData(response.data); // Guarda los registros de pagos
      } catch (error) {
        console.error("Error al obtener registros de pago:", error);
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
     const isPending = status === "pendiente" || status === "parcial";  
    return {
      ...tent,
      paymentStatus: isPending ? "falta pago" : "pagada",
    };
  });


  const confirmFinishClick = async (params) => {
    try {
      // Actualizo el estado de tent a "Completada"
      const tentId = params.row._id;
      const completedStatusId = "668ddd216630f103dda28cde"; 
  
      await  axiosInstance.put(`/tents/${tentId}`, {
        status: completedStatusId,
        location: { row: "", col: "" },
      });
  
      tentsObserver.notify();
    } catch (error) {
      console.error("Error al finalizar:", error);
    }
  };

  const handleCancelClick = async (params) => {
  const confirmCancel = window.confirm("¿Estás seguro de que quieres cancelar esta estadía en carpa?");
  if (!confirmCancel) return; // Si el usuario cancela, se detiene la ejecución

  try {
    const tentId = params.row._id;
    const canceledStatusId = "668ddd316630f103dda28cdf"; 

    await axiosInstance.put(`/tents/${tentId}`, {
      status: canceledStatusId,
      location: { row: "", col: "" },
    });

    tentsObserver.notify();
  } catch (error) {
    console.error("Error cancelando la estadía en carpa:", error);
  }
};


  const actionColumn = [
    {
      width: 200,
      renderCell: (params) => {
        const isPending = params.row.paymentStatus === "falta pago";
        
        // Buscar el registro de accounting correspondiente a la carpa
        const relatedAccounting = accountingData.find(
          (record) => String(record.tent?._id) === String(params.row._id)
        );
        const accountingId = relatedAccounting?._id; // Obtener el ID de accounting
  
        const handlePaymentClick = () => {
          if (accountingId) {
            navigate(`/accounting/${accountingId}`); // Redirige a la página de detalles
          }
        };
  
        return (
          <div className="cellAction">
            {isPending && (
              <Tooltip title="Estadia no pagada">
                <WarningIcon
                  color="error"
                  style={{ marginLeft: 3, cursor: "pointer" }} 
                  onClick={handlePaymentClick} // Redirige al hacer clic
                />
              </Tooltip>
            )}
            <div 
              className={`deleteButton ${isPending ? "disabledButton" : ""}`} 
              onClick={() => !isPending && confirmFinishClick(params)} 
              style={{ cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.5 : 1 }}
            >
              Finalizar
            </div>
            <div className="cancelButton" onClick={() => handleCancelClick(params)}>
              Cancelar
            </div>
          </div>
        );
      },
    },
  ];
  
  const addNewButton = () => navigate("new");
  const handleHistoricButton = () => navigate("historico");

  return (
    <div className="datatable">
      <div className="datatableTitle">Carpas</div>
      <button className="styleButtons addButton" onClick={addNewButton}>Añadir Carpa </button>
      <button className="styleButtons historyButton" onClick={handleHistoricButton}> Historia </button>
      <DataGrid
        className="datagrid"
        rows={tentsWithPaymentStatus}
        columns={[...userColumns, ...actionColumn]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
