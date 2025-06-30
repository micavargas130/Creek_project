import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Warning as WarningIcon } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { userColumns } from "../../datatablesourceLodges.js";
import { Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch.js";
import axiosInstance from "../../axios/axiosInstance.js"
import Tooltip from '@mui/material/Tooltip';
import globalObserver from "../../utils/observer.js";

const Datatable = (props) => {
  const {data, refetch }  = useFetch("/lodges")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [maintenanceText, setMaintenanceText] = useState("");
  const [selectedParams, setSelectedParams] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
  const handleStatusChange = () => {
    console.log("Refetch triggered"); // 👈 agregá esto
    refetch();
  };
  globalObserver.subscribe("changesLodges", handleStatusChange);
  return () => globalObserver.unsubscribe("changesLodges", handleStatusChange);
}, []);

  //para cuando se elige el estado "mantenimiento"
  const handleMaintenanceSubmit = (params) => {
    try {
      axiosInstance.post(`lodge_x_status/`, {
        lodge: params.row._id,
        status: "668f308770711974d54762d0",
        comment: maintenanceText,
      });
  
      // Cierra el diálogo y recarga la página
      closeDialog();
      globalObserver.notify("changesLodges");
    } catch (error) {
      console.error('Error al enviar el comentario de mantenimiento al servidor:', error);
    }
    // Cierra el diálogo
    closeDialog();
  };

  //Abrir ventana para dejar el comment
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  //Aca se declaran los botones y sus funcionalidades
  const actionColumn = [
    {
      width: 400,
      renderCell: (params) => {
        // Obtención de estado y pago desde los datos que vienen del backend
        const isOccupied = params.row.latestStatus === "ocupado"; // Cambiado de params.row.state.status
        const isPaid = params.row.paymentInfo?.paymentStatus === "pagada"; 
        const isMantained = params.row.latestStatus === "mantenimiento"; 
    
        // Función para liberar la cabaña (de ocupada o mantenimiento a desocupada)
        const handleLiberar = async () => {
      
        if (isOccupied && !isPaid) return; // Bloquear si está ocupada y no pagada
      
        try {
          if (isMantained) {
            // Si está en mantenimiento, cambia a desocupado sin comentario
            await axiosInstance.post(`lodge_x_status/`, {
              lodge: params.row._id,
              status: "668f301d70711974d54762ce", // Estado "desocupado"
            });
          } else if (isOccupied) {
            // Si está ocupada y pagada, cambia a mantenimiento con comentario
            await axiosInstance.post(`lodge_x_status/`, {
              lodge: params.row._id,
              status: "668f308770711974d54762d0", // Estado "mantenimiento"
              comment: "Limpiar cabaña",
            });
          }
      
          globalObserver.notify("changesLodges");
        } catch (error) {
          console.error("Error al cambiar el estado de la cabaña:", error);
        }
      };
  
        // Función para poner en mantenimiento
        const handleMantenimiento = () => {
          setSelectedParams(params);
          openDialog();
        };
  
        return (
          <div className="cellAction">
            {/* Si la cabaña está ocupada o en mantenimiento, muestra el botón "Liberar" */}
            {isOccupied || isMantained ? (
              <Tooltip title={isOccupied && !isPaid ? "No se puede liberar: pago pendiente" : ""}>
                <div
                  className="stateButton"
                  onClick={handleLiberar}
                  disabled={isOccupied && !isPaid} // Solo deshabilita si está ocupada y no pagada
                  style={{
                    cursor: isOccupied && !isPaid ? "not-allowed" : "pointer",
                    opacity: isOccupied && !isPaid ? 0.5 : 1,
                  }}
                >
                  Liberar
                </div>
              </Tooltip>
            ) : (
              <div className="mantainanceButton" onClick={handleMantenimiento}>
                Mantenimiento
              </div>
            )}
  
            {/* Botón para ver la contabilidad si está ocupada */}
            {isOccupied && params.row.paymentInfo && (
              <Link to={`/accounting/${params.row.paymentInfo._id}`} style={{ textDecoration: "none" }}>
                <div className="viewButton">Info</div>
              </Link>
            )}
  
            {/* Botón para modificar datos */}
            <div className="modifyButton" onClick={() => navigate(`/lodges/lodgeInfo/${params.row._id}`)}>
              Modificar
            </div>
  
            {/* Botón para ver historial */}
            <div className="modifyButton" onClick={() => navigate(`/lodges/history/${params.row._id}`)}>
              Historial
            </div>
  
            {/* Si la reserva no está pagada y está ocupada, muestra advertencia */}
            {!isPaid && isOccupied && (
              <Tooltip title="Reserva no pagada">
                <WarningIcon color="error" style={{ marginLeft: 8 }} />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
  
  //Botón para agregar nueva cabaña
  const addNewButton = () => {
    navigate('new');
  };
  
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Cabañas
      </div>
      <button className="styleButtons addButton" onClick={addNewButton}>Añadir Cabaña </button>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId = {row => row._id}
      />
      <Dialog open={isDialogOpen} onClose={closeDialog}>
      <DialogTitle>Ingresar texto de mantenimiento</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Texto de mantenimiento"
          variant="outlined"
          multiline
          rows={4}
          value={maintenanceText}
          onChange={(e) => setMaintenanceText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Cancelar
        </Button>
        <Button onClick={() => handleMaintenanceSubmit(selectedParams)} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default Datatable;