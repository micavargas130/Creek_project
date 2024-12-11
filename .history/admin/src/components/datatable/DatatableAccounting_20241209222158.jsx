import "./datatable.scss";
import WidgetsContainer from "../../components/widget/widgetContainer";
import { getTotalMoney, getIncomes, getExpenses } from "../../components/widget/accountingUtils.jsx";
import Chart from "../../components/chart/ChartAccounting.jsx";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { userColumns} from "../../datatablesourceAccounting.js";
import { Link} from "react-router-dom";
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
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();
  const [remainingAmount, setRemainingAmount] = useState(0);

  const totalIncome = getIncomes(data);
  const totalExpense = getExpenses(data);
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
  setRemainingAmount(params.row.totalAmount - params.row.amount); // Calcula el saldo restante
  setIsStatusDialogOpen(true);
};


  const closeStatusOptions = () => {
    setIsStatusDialogOpen(false);
  };
  

  //Maneja el envio de comentario
  const handleCommentSubmit = (params) => {
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
            window.location.reload();
          } catch (error) {
            console.error("Error deleting accounting:", error);
          }
        };

        const handleChangeStatusClick = (params) => {
          openStatusOptions(params);
        };
        
        //constante para ver si se muestra o no el pago parcial o pendiente
        const showChangeStatusButton = ["parcial", "pendiente"].includes(params.row.status.status);
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
            {showChangeStatusButton && (
            <div className="statusButton" onClick={() => handleChangeStatusClick(params)}>
              Completar Pago
            </div>
          )}
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

  

  const namesColumns = [
    {
        field: "client",
        headerName: "Cliente",
        width: 150,
        valueGetter: (params) => {          
          if(params.row.lodge) return ((params.row.user?.first_name + " " + params.row.user?.last_name)|| "No nombre" )// Cambia `name` al campo correcto si es distinto
          if(params.row.tent) return ((params.row.tent?.first_name + " " + params.row.tent?.last_name ) || "No nombre")
         },
    },

    {
        field: "entity",
        headerName: "Entidad",
        width: 150,
        valueGetter: (params) => {
          console.log("params",params.row);
            if (params.row.lodge) return params.row.lodge.lodge.name || "Cabaña";
            if (params.row.tent) return "Carpa";
            return "N/A";
        },
    },

   
];

  return (
    <div className="datatable">
      <div className="datatableTitle">Contabilidad</div>
      <button className="styleButtons addButton" onClick={addNewButton}>Add New </button>
      <button styleButtons historyButton" onClick={newPricesButton} className="link">Modificar precios</button>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={[...userColumns, ...namesColumns, ...actionColumn]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />

    <Dialog open={isStatusDialogOpen} onClose={closeStatusOptions}>
      <DialogTitle>Completar Pago</DialogTitle>
      <DialogContent>
         <p><strong>Saldo pendiente:</strong> ${remainingAmount}</p>
         <p>¿Desea completar el pago?</p>
      </DialogContent>
      <DialogActions>
      <Button color="primary" onClick={async () => {
         try {
               // Envía la solicitud para actualizar el registro y agregar al historial de pagos
               await axios.post(`http://localhost:3000/accounting/pay/${selectedParams.row._id}`, {
                  amount: selectedParams.row.remainingAmount, // Monto restante que se paga
                   status: "pagada", // Cambia el estado a pagada
                });

         closeStatusOptions();
         window.location.reload(); // Recargar para mostrar cambios
        } catch (error) {
        console.error("Error al completar el pago:", error);
                        }
       }}> Completar Pago </Button>
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
