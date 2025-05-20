import "./datatable.scss";
import { getTotalMoney, getIncomes, getExpenses } from "../../components/widget/accountingUtils.jsx";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ChartContainer from '../../components/chart/chartContainer.jsx'
import { userColumns} from "../../datatablesourceAccounting.js";
import { Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axiosInstance from "../../axios/axiosInstance.js"
import accountingObserver from import { notify } from "../../utils/observer.js";;


const Datatable = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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


const fetchData = async () => {
  try {
    setLoading(true);
    const res = await axiosInstance.get("/accounting");
    setData(res.data);
  } catch (error) {
    console.error("Error al obtener datos:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
  accountingObserver.subscribe(fetchData); // Te suscribís al observer
  return () => {
    accountingObserver.unsubscribe(fetchData); // Limpiás al desmontar
  };
}, []);

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
  const handleCommentSubmit = async () => {
    if (!selectedParams) return; // Asegúrate de que haya parámetros seleccionados
    try {
      await axiosInstance.put(`/accounting/comment/${selectedParams.row._id}`, {
        comment: maintenanceText,
      });
      closeDialog();
      accountingObserver.notify(); 
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
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
    let accumulatedTotal = 0; // Saldo acumulado
    return data.map((entry) => {
      accumulatedTotal += entry.type === "Ingreso" ? entry.amount : -entry.amount; // Sumar o restar según tipo
      return {
        name: entry.date, 
        Total: accumulatedTotal, // Representa el saldo acumulado
      };
    });
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
            const confirmCancel = window.confirm("¿Esas seguro de querer borrar permanentemente este registro?");
            if (!confirmCancel) return; // Si el usuario elige "No", se detiene la acción
            await axiosInstance.delete(`http://localhost:3000/accounting/${params.row._id}`);
            accountingObserver.notify(); 
          } catch (error) {
            console.error("Error deleting accounting:", error);
          }
        };

        const handleChangeStatusClick = (params) => {
          openStatusOptions(params);
        };
        
        //constante para ver si se muestra o no el pago parcial o pendiente
        const showChangeStatusButton = ["parcial", "pendiente"].includes(params.row.status.status);
        const showViewButton = ["Ingreso"].includes(params.row.type)
        //Aca se declaran los botones "View", "Delete", "Comentario" y "Cambiar estado" y tmb se llaman sus respectivas funciones
        return (
          <div className="cellAction">
            {showViewButton && (
            <Link to={`/accounting/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Info</div> 
            </Link>
            ) }
            <div className="deleteButton" onClick={handleCancelClick}>
              Borrar
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

  useEffect(() => {
    // Procesar datos para Ingresos vs Egresos
    const groupedData = {};
    
    data.forEach((entry) => {
      const month = new Date(entry.date).toLocaleString("es-ES", { month: "short" });
  
      if (!groupedData[month]) {
        groupedData[month] = { month, income: 0, expense: 0 };
      }
  
      if (entry.type === "Ingreso") {
        groupedData[month].income += entry.amount;
      } else if (entry.type === "Egreso") {
        groupedData[month].expense += entry.amount;
      }
    });
  
    setChartData(Object.values(groupedData));
  }, [data]);
  

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
        width: 120,
        valueGetter: (params) => {          
          if(params.row.lodge) return ((params.row.user?.first_name + " " + params.row.user?.last_name)|| "No nombre" )// Cambia `name` al campo correcto si es distinto
          if(params.row.tent) return ((params.row.tent?.first_name + " " + params.row.tent?.last_name ) || "No nombre")
         },
    },

    {
        field: "entity",
        headerName: "Entidad",
        width: 100,
        valueGetter: (params) => {
            if (params.row.lodge) return params.row.lodge.lodge.name || "Cabaña";
            if (params.row.tent) return "Carpa";
            return "N/A";
        },
    },
];

  return (
    <div className="datatable">
      <div className="datatableTitle">Contabilidad</div>
      <button className="styleButtons addButton" onClick={addNewButton}>Agregar Ingreso/Egreso </button>
      <button className="styleButtons pricesButton" onClick={newPricesButton}>Modificar precios</button>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={[...userColumns, ...namesColumns, ...actionColumn]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />

{/*Boton para pagar lo que se debe*/}
    <Dialog open={isStatusDialogOpen} onClose={closeStatusOptions}>
      <DialogTitle>Completar Pago</DialogTitle>
         <DialogContent> <p><strong>Saldo pendiente:</strong> ${remainingAmount}</p>
         <p>¿Desea completar el pago?</p> </DialogContent>
       <DialogActions>
           <Button color="primary" onClick={async () => {
             try {
                   // Envía la solicitud para actualizar el registro y agregar al historial de pagos
                   await axiosInstance.post(`/accounting/pay/${selectedParams.row._id}`, {
                      amount: selectedParams.row.remainingAmount, // Monto restante que se paga
                       status: "pagada", // Cambia el estado a pagada
                    });
                  closeStatusOptions();
                  accountingObserver.notify();  // Recargar para mostrar cambios
                  } catch (error) {  console.error("Error al completar el pago:", error);}
              }}> Completar Pago 
           </Button>
      </DialogActions>
    </Dialog>


    {/*Selector de estado*/}
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
               await axiosInstance.post(`http://localhost:3000/accounting/pay/${selectedParams.row._id}`, {
                  amount: selectedParams.row.remainingAmount, // Monto restante que se paga
                  status: "pagada", // Cambia el estado a pagada
                });

                closeStatusOptions();
                accountingObserver.notify();  // Recargar para mostrar cambios
               } catch (error) {
              console.error("Error al completar el pago:", error);
                        }
             }}> Completar Pago </Button>
       </DialogActions>
    </Dialog>

    {/* Text Box para el comentario*/}
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

      <ChartContainer 
  rawData={data} // ✅ data cruda para los demás gráficos
  processedData={processDataForChart(data)} // ✅ solo para el de evolución
  chartData={chartData}
  totalMoney={totalMoney}
  totalIncome={totalIncome}
  totalExpense={totalExpense}
/>
    </div>
  );
};

export default Datatable;
