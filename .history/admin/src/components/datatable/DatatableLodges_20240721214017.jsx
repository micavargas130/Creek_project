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
import { userColumns } from "../../datatablesourceLodges.js";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import Tooltip from '@mui/material/Tooltip';

const Datatable = () => {
  const { data, loading, error } = useFetch("/lodges");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [menuStates, setMenuStates] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [maintenanceText, setMaintenanceText] = useState("");
  const [selectedParams, setSelectedParams] = useState(null);
  
  const navigate = useNavigate();
  
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

  //Seleccionar un estado
  const handleOptionSelect = async (option, params) => {
    setSelectedParams(params);

    try {
      if (option === "desocupado") {
        await axios.put(`/lodges/${params.row._id}/state`, { state: "desocupado" });
        await axios.put(`/lodges/${params.row._id}/comment`, { comment: "" });
      }

      if (option === "mantenimiento") {
        openDialog();
        await axios.put(`/lodges/${params.row._id}/state`, { state: "mantenimiento" });
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la cabaña", error);
    }

    handleMenuClose(params.row._id);
  };

  const handleMaintenanceSubmit = async (params) => {
    try {
      await axios.put(`/lodges/${params.row._id}/comment`, {
        comment: maintenanceText,
      });
  
      closeDialog();
      window.location.reload();
    } catch (error) {
      console.error('Error al enviar el comentario de mantenimiento al servidor:', error);
    }
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
      width: 450,
      renderCell: (params) => {

        const handleCancelClick = async () => {
          try {
            if (params.row.state === "Ocupado") {
              alert("No se puede eliminar una cabaña ocupada");
            } else {
              await axios.delete(`http://localhost:3000/lodges/${params.row._id}`);
              await axios.delete(`http://localhost:3000/bookings/${params.row._id}/bookings`);
              console.log(`${params.row._id}`);
            }
          } catch (error) {
            console.error("Error canceling booking:", error);
          }
        };

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
            <Tooltip title={params.row.state === 'mantenimiento' ? params.row.comment : ''}>
              <div
                className="stateButton"
                onClick={(event) => handleMenuClick(event, params.row._id)}
              >
                Cambiar estado
              </div>
            </Tooltip>
            <Menu
              anchorEl={menuStates[params.row._id] || null}
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
        rows={data.map((row) => ({ ...row, id: row._id }))}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
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
