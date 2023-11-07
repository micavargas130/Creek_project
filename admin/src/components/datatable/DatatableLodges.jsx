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
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";


const Datatable = (props) => {
  const {data, loading, error} = useFetch("/lodges")
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [menuStates, setMenuStates] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [maintenanceText, setMaintenanceText] = useState("");

  const handleMenuClick = (event, rowId) => {
    setMenuStates((prevMenuStates) => ({
      ...prevMenuStates,
      [rowId]: event.currentTarget,
    }));
  };

  const handleMenuClose = (rowId) => {
    setMenuStates((prevMenuStates) => ({
      ...prevMenuStates,
      [rowId]: null,
    }));
  };

  const handleOptionSelect = (option, params) => {
    console.log(params.row._id);
    if (option === "desocupado") {
      axios.put(`lodges/deloccupiedBy/${params.row._id}`);
      axios.put(`lodges/set-desoccupied/${params.row._id}`);
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
      width: 300,
      renderCell: (params) => {

        const getDatesInRange = (start, end) => {
          const startDate = new Date(start);
          const endDate = new Date(end);
          const dates = [];
        
          // Agregar la fecha de inicio a la lista
          dates.push(new Date(startDate)); // Clonar la fecha
        
          // Calcular las fechas intermedias
          while (startDate < endDate) {
            const newDate = new Date(startDate);
            newDate.setDate(newDate.getDate() + 1);
            console.log(newDate);
            dates.push(newDate); // Agregar una copia de la fecha
            startDate.setDate(startDate.getDate() + 1);
            console.log(dates);
          }
        
          // Aplicar el reemplazo a cada elemento del array
          const datesWithReplacement = dates.map((date) => {
            return date.toISOString().replace('T00:00:00.000Z', 'T03:00:00.000Z');
          });
        
          return datesWithReplacement;
        };
      
        const handleCancelClick = async () => {
          try {
          
            await axios.delete(`/bookings/${params.row.id}`);
            const datesToDelete = getDatesInRange(params.row.checkIn, params.row.checkOut);
            console.log(params.row.place)
            console.log(params.row.checkIn)
            console.log(params.row.checkOut)
            await axios.put(`/lodges/delavailability/${params.row.place}`,{
              id: params.row.place,
              dates: datesToDelete
            }); 
      
           // window.location.reload();
          } catch (error) {
            console.error("Error canceling booking:", error);
          }
        };

       

        

        return (
          <div className="cellAction">
            <Link to={`/lodges/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={handleCancelClick}
            >
              Delete
            </div>
            <div
              className="stateButton"
              onClick={(event) => handleMenuClick(event, params.row._id)}
            >
               Cambiar estado
            </div>
            <Menu
          anchorEl={menuStates[params.row._id] || null}
          open={Boolean(menuStates[params.row._id])}
          onClose={() => handleMenuClose(params.row._id)}
        >
          {["ocupado", "desocupado", "mantenimiento"].map((option) => (
            <MenuItem key={option} onClick={() => handleOptionSelect(option, params)}>
              {option}
            </MenuItem>
          ))}
        </Menu>       
          </div>
        );
      },
    },
  ];

  const handleMaintenanceSubmit = () => {
    // Aquí puedes realizar la acción de mantenimiento con el texto ingresado
    console.log("Texto de mantenimiento:", maintenanceText);
  
    // Cierra el diálogo
    closeDialog();
  };
  
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Cabañas
      </div>
      <button  className="link">
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
        <Button onClick={handleMaintenanceSubmit} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default Datatable;