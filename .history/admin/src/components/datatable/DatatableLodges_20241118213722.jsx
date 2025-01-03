import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import {useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import Tooltip from '@mui/material/Tooltip';

const Datatable = (props) => {
  const {data, loading, error} = useFetch("/lodges")
  const [menuStates, setMenuStates] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [maintenanceText, setMaintenanceText] = useState("");
  const [selectedParams, setSelectedParams] = useState(null);
  const navigate = useNavigate()

  //abrir menu con estados
  const handleMenuClick = (event, rowId) => {
    setMenuStates((prevMenuStates) => ({
      ...prevMenuStates,
      [rowId]: event.currentTarget,
    }));
  };

  //cerrar menu con estados
  const handleMenuClose = (rowId) => {
    setMenuStates((prevMenuStates) => ({
      ...prevMenuStates,
      [rowId]: null,
    }));
  };

  //seleccion de estado
  const handleOptionSelect = (option, params) => {
    setSelectedParams(params);
    
    if (option === "desocupado") {
      axios.put(`lodges/deloccupiedBy/${params.row._id}`);
      axios.put(`lodges/set-desoccupied/${params.row._id}`);
      axios.put(`lodges/eliminarComment/${params.row._id}`);
      console.log(params.row._id)
      axios.put(`lodge_x_status/`, {
        lodge: params.row._id,
        status: "668f301d70711974d54762ce",
      });

    }
  
    if (option === "mantenimiento") {
      openDialog();
      axios.put(`lodges/set-manteined/${params.row._id}`);
      
      
    }
  
    handleMenuClose(params.row._id);
  };


  //para cuando se elige el estado "mantenimiento"
  const handleMaintenanceSubmit = (params) => {
    try {
        axios.put(`http://localhost:3000/lodges/comment/${params.row._id}`, {
        comment: maintenanceText,
      });
      axios.put(`lodge_x_status/`, {
        lodge: params.row._id,
        status: "668f308770711974d54762d0",
        comment: maintenanceText,
      });
  
      // Cierra el diálogo y recarga la página
      closeDialog();
      window.location.reload();
    } catch (error) {
      console.error('Error al enviar el comentario de mantenimiento al servidor:', error);
    }
    // Cierra el diálogo
    closeDialog();
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 400,
      renderCell: (params) => {


        //Cuando se elimina una cabaña      
        const handleHistoryClick = async () => {
          try {
            navigate(`/lodges/history/${params.row._id}`); // Navega pasando el ID de la cabaña
          } catch (error) {
            console.error("Error navigating to history:", error);
          }
        };
       
        //Cuando se quieren modificar los datos de una cabaña
        const handleModifyClick = async () => {
          try {
            navigate(`/lodges/lodgeInfo/${params.row._id}`);
          } catch (error) {
            console.error("Error modifying lodge:", error);
          }
        };

      const isOccupied = params.row.state && params.row.state.status === "ocupado";
      const isPaid = params.row.occupiedBy && params.row.occupiedBy.paymentStatus === "paid";

        return (
          <div className="cellAction">
            { isOccupied && (
           <Link to={`/lodges/${params.row._id}`} style={{ textDecoration: "none" }}>
           <div className="viewButton">View</div>
           </Link>

           
            )}

          <Tooltip title={params.row.state.status === 'mantenimiento' ? params.row.comment : ''}>
          <div className="stateButton" onClick={(event) => handleMenuClick(event, params.row._id)}> Cambiar estado </div>
          </Tooltip>
            <Menu  anchorEl={menuStates[params.row._id] || null}
                   open={Boolean(menuStates[params.row._id])}
                   onClose={() => handleMenuClose(params.row._id)}
            >
          {["desocupado", "mantenimiento"].map((option) => (
            <MenuItem key={option} onClick={() => handleOptionSelect(option, params)}>
              {option}
            </MenuItem>
          ))}
        </Menu>  
        <div
              className="modifyButton"
              onClick={handleModifyClick}
            >
              Modificar
        </div>  

         <div
              className="modifyButton"
              onClick={handleHistoryClick}
            >
              Historial
            </div>  

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
      <button onClick={addNewButton} className="link">
          Add New
        </button>
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