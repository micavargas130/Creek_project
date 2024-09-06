import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { userColumns, userRows } from "../../datatablesourceLodges.js";
import { Link, Navigate} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import Tooltip from '@mui/material/Tooltip';

const Datatable = (props) => {
  const {data, loading, error} = useFetch("/lodges")
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
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
    console.log(params.row._id);
    if (option === "desocupado") {
      axios.put(`lodges/deloccupiedBy/${params.row._id}`);
      axios.put(`lodges/set-desoccupied/${params.row._id}`);
      axios.put(`lodges/eliminarComment/${params.row._id}`);
      window.location.reload()
    }
    if (option === "mantenimiento"){
      console.log("Abrir diálogo de mantenimiento");
      openDialog()
      console.log("despues de diálogo de mantenimiento");
      axios.put(`lodges/set-manteined/${params.row._id}`);
    }
    handleMenuClose(params.row._id);
  };

  //para cuando se elige el estado "mantenimiento"
  const handleMaintenanceSubmit = (params) => {
    console.log("ID:",`${params.row._id}`);
    try {
        axios.put(`http://localhost:3000/lodges/comment/${params.row._id}`, {
        comment: maintenanceText,
      });
  
      // Cierra el diálogo y recarga la página
      closeDialog();
      window.location.reload();
    } catch (error) {
      console.error('Error al enviar el comentario de mantenimiento al servidor:', error);
      // Puedes agregar manejo de errores aquí según tus necesidades
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
        const handleCancelClick = async () => {
          try {

            if(params.row.state === "ocupado"){alert("No se puede eliminar una cabaña ocupada")}
            else {
          
            axios.delete(`http://localhost:3000/lodges/${params.row._id}`);
            axios.delete(`http://localhost:3000/bookings/${params.row._id}/bookings`);
            console.log(`${params.row._id}`)
            window.location.reload()
          }
      
           window.location.reload();
          } catch (error) {
            console.error("Error canceling booking:", error);
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

      

        return (
          <div className="cellAction">
           {params.row.state === "Ocupado" && (
              <Link to={`/lodges/${params.row._id}`} style={{ textDecoration: "none" }}>
                <div className="viewButton">View</div>
              </Link>
            )}
            <div
              className="deleteButton"
              onClick={handleCancelClick}
            >
              Delete
            </div>
            <Tooltip title={params.row.state === 'Mantenimiento' ? params.row.comment : ''}>
            <div
              className="stateButton"
              onClick={(event) => handleMenuClick(event, params.row._id)}
            >
               Cambiar estado
            </div>
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