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
import Widget from "../../components/widget/WidgetAccounting";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";

import axios from "axios";

const Datatable = (props) => {
  const {data, loading, error} = useFetch("/accounting")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [maintenanceText, setMaintenanceText] = useState("");
  const [selectedParams, setSelectedParams] = useState(null);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate()

  const openDialog = () => {
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };


  const handleCommentClick = (params) => {
    setSelectedParams(params);
    openDialog();
    
  };

  const handleCommentSubmit = (params) => {
    console.log("ID:",`${params.row._id}`);
    try {
        axios.put(`http://localhost:3000/accounting/comment/${params.row._id}`, {
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

  const getTotalMoney = (data) => {
    // Verifica si los datos están definidos y no están vacíos
    if (!data || data.length === 0) {
      return 0; // Si no hay datos, el dinero total es 0
    }
  
    // Suma los valores de la propiedad "amount" de cada entrada contable
    const totalMoney = data.reduce((accumulator, currentValue) => {
      // Asegúrate de que "amount" y "type" estén definidos en el objeto actual
      if (currentValue && currentValue.amount && currentValue.type) {
        // Si el tipo es "income", suma al acumulador; si es "expense", resta
        return currentValue.type === "Ingreso"
          ? accumulator + currentValue.amount
          : accumulator - currentValue.amount;
      } else {
        return accumulator;
      }
    }, 0);
  
    return totalMoney;
  };
  

  useEffect(() => {
    // Estructura los datos para el gráfico
    const chartData = data.map((entry) => ({
      name: entry.date, // Supongo que "date" es la propiedad de fecha
      Total: entry.amount, // Supongo que "amount" es la propiedad de cantidad
    }));

    setChartData(chartData);
  }, [data]);

  const processDataForChart = (data) => {
    return data.map((entry) => ({
      name: entry.date, 
      Total: entry.amount, 
    }));
  };
  



  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {

        const handleCancelClick = async () => {
          try {
          
            axios.delete(`http://localhost:3000/accounting/${params.row._id}`);
            console.log(`${params.row._id}`)
            window.location.reload()
          
          } catch (error) {
            console.error("Error deleting accounting:", error);
          }
        };

      

        return (
          <div className="cellAction">
            <Link to={`/accounting/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={handleCancelClick}
            >
              Delete
            </div>
            <div
              className="commentButton"
              onClick={(event) => handleCommentClick(params)}
            >
               Comentario
            </div>
       
          </div>
        );
      },
    },
  ];


  const addNewButton = () => {
    // Aquí puedes realizar la acción de mantenimiento con el texto ingresado
    navigate('new');
  };
  
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Contabilidad
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
      <DialogTitle>Ingresar comentario</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Comentaria"
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
        <Button onClick={() => handleCommentSubmit(selectedParams)} color="primary">
          Guardar
        </Button>
      </DialogActions>
     
    </Dialog>
    <div className="chartsContainer">
      <Chart aspect={4 / 1} title="Evolución del Dinero" data={processDataForChart(data)} />
      <Widget type="totalMoney" totalMoney={getTotalMoney(data)} />
      <Widget type="totalIncome" totalIncome={getTotalMoney(data)} />
      <Widget type="totalExpense" totalExpense={getTotalMoney(data)} />
    </div>
    </div>
  );
};

export default Datatable;