import "./datatable.scss";
import Chart from "../../components/chart/ChartAccounting.jsx";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { userColumns, userRows } from "../../datatablesourceAccounting.js";
import { Link, Navigate} from "react-router-dom";
import {useNavigate} from "react-router-dom";

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";

import axios from "axios";

const Datatable = (props) => {
  const {data, loading, error} = useFetch("/accounting")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [maintenanceText, setMaintenanceText] = useState("");
  const [selectedParams, setSelectedParams] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("pagada");
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

 // const totalIncome = getIncomes(data);
 // const totalExpense = getExpenses(data);
  const totalMoney = getTotalMoney(data);

  //Ventana para dejar comentario
  const openDialog = () => {
    setIsDialogOpen(true);
  };

 const closeDialog = () => {
    setIsDialogOpen(false);
  };

  //Maneja el ingreso del comment
   const handleCommentClick = (params) => {   
    setSelectedParams(params);
    openDialog();
  };



  //Ventana para elegir el estado
  const openStatusOptions = (params) => {
    setSelectedParams(params);
    setIsStatusDialogOpen(true);
  };

  const closeStatusOptions = () => {
    setIsStatusDialogOpen(false);
  };
  
  const handleStatusSelect = (event) => {
    setSelectedStatus(event.target.value);
   
  };

  //Maneja el envio de comentario
  const handleCommentSubmit = (params) => {
    console.log("ID:",`${params.row._id}`);
    try {
        axios.put(`/accounting/comment/${params.row._id}`, {
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


  //Maneja el cambio de estado
  const handleStatusChange = (params) => {

    try {
     
    axios.put(`http://localhost:3000/accounting/status/${params.row._id}`, {status: selectedStatus});
     
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    } finally {
      closeStatusOptions();
      window.location.reload();
    }
  };

  //FUNCIONES PARA LOS GRAFICOS

  useEffect(() => {
    const chartData = data.map((entry) => ({
      name: entry.date,
      Total: entry.amount,
    }));

    setChartData(chartData);
  }, [data]);

  const processDataForChart = (data) => {
    return data.map((entry) => ({
      name: entry.date, 
      Total: entry.amount, 
    }));
  };


  //Columna de botones
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 400,
      renderCell: (params) => {
        const handleCancelClick = async () => {
          try {
            await axios.delete(`http://localhost:3000/accounting/${params.row._id}`);
            console.log(`${params.row._id}`);
            window.location.reload();
          } catch (error) {
            console.error("Error deleting accounting:", error);
          }
        };

        const handleChangeStatusClick = (params) => {
          openStatusOptions(params);
        };
        
        //Aca se declaran los botones "View", "Delete", "Comentario" y "Cambiar estado" y tmb se llaman sus respectivas funciones
        return (
          <div className="cellAction">
            <Link to={`/accounting/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div> 
            </Link>
            <div className="deleteButton" onClick={handleCancelClick}>
              Delete
            </div>
            <div className="commentButton" onClick={() => handleCommentClick(params)}>
              Comentario
            </div>
            <div className="statusButton" onClick={() => handleChangeStatusClick(params)}>
              Cambiar Estado
            </div>
          </div>
        );
      },
    },
  ];

  //Hace el cambio de pagina a New cuando se quiere agregar un ingreso/egreso nuevo
  const addNewButton = () => {
    navigate('new');
  };
  const newPricesButton = () => {
    navigate('newPrices');
  };


  return (
    <div className="datatable">
      <div className="datatableTitle">Contabilidad</div>
      <button onClick={addNewButton} className="link">Add New</button>
      <button onClick={newPricesButton} className="link">Modificar precios</button>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Ingresar comentario</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Comentario"
            variant="outlined"
            multiline
            rows={4}
            value={maintenanceText}
            onChange={(e) => setMaintenanceText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">Cancelar</Button>
          <Button onClick={() => handleCommentSubmit(selectedParams)} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>

  <Dialog open={isStatusDialogOpen} onClose={closeStatusOptions}>
  <DialogTitle>Cambiar Estado del Pago</DialogTitle>
  <DialogContent>
    <select value={selectedStatus} onChange={handleStatusSelect}>
      <option value="pagada">Pagada</option>
      <option value="parcial">Parcial</option>
      <option value="pendiente">Pendiente</option>
    </select>
  </DialogContent>
  <DialogActions>
    <Button onClick={closeStatusOptions} color="primary">Cancelar</Button>
    <Button onClick={() => handleStatusChange(selectedParams)} color="primary">Guardar</Button>
  </DialogActions>
</Dialog>

      <div className="chartsContainer">
        <Chart aspect={4 / 1} title="Evolución del Dinero" data={processDataForChart(data)} />
        <WidgetsContainer totalMoney={totalMoney} totalIncome={totalIncome} totalExpense={totalExpense} />
      </div>
    </div>
  );
};

export default Datatable;
