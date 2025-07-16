import "./datatable.scss";
import { getTotalMoney, getIncomes, getExpenses } from "../../components/widget/accountingUtils.jsx";
import { DataGrid } from "@mui/x-data-grid";
import ChartContainer from '../../components/chart/chartContainer.jsx'
import { userColumns} from "../../datatablesourceAccounting.js";
import { Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance.js";
import globalObserver from "../../utils/observer.js";
import CommentDialog from "../props/commentDialog.jsx";
import CompletePaymentDialog from "../props/completePaymentDialog.jsx";
import ReturnDepositDialog from "../props/returnDepositDialog.jsx";


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
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const totalIncome = getIncomes(data);
  const totalExpense = getExpenses(data);
  const totalMoney = getTotalMoney(data);
  

const fetchData = async () => {
  try {
    setLoading(true);
    const res = await axiosInstance.get("/accounting");
    // Ordena por fecha descendente (los más nuevos primero)
    const sortedData = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setData(sortedData);
  } catch (error) {
    console.error("Error al obtener datos:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData(); 
  const handleAccountingChange = () => {
    fetchData();
  };
  globalObserver.subscribe("accountingChange", handleAccountingChange);
  return () => {
    globalObserver.unsubscribe("accountingChange", handleAccountingChange);
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

  const openReturnDialog = (params) => {
  setSelectedParams(params);
  setIsReturnDialogOpen(true);
};

const closeReturnDialog = () => {
  setIsReturnDialogOpen(false);
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
    globalObserver.notify("accountingChange");
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
    disableColumnMenu: true,
    sortable: false,
    width: 350,
    renderCell: (params) => {
      const handleCancelClick = async () => {
        try {
          const confirmCancel = window.confirm("¿Esas seguro de querer borrar permanentemente este registro?");
          if (!confirmCancel) return;
          await axiosInstance.delete(`/accounting/${params.row._id}`);
          globalObserver.notify("accountingChange");
        } catch (error) {
          console.error("Error deleting accounting:", error);
        }
      };
      const handleChangeStatusClick = (params) => {
        openStatusOptions(params);
      };
      const showChangeStatusButton = ["parcial"].includes(params.row.status.status);
      const showReturnButton = ["devolución"].includes(params.row.status.status);
      const showViewButton = ["Ingreso"].includes(params.row.type);
      const isLodgeCanceled = params.row.lodge?.status === "67affcc10cb373c285f445eb";

      return (
        <div className="cellAction">
          {showViewButton && (
            <Link to={`/accounting/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Info</div>
            </Link>
          )}
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
          {(isLodgeCanceled &&  (
            <div
              title="La reserva vinculada a este registro fue cancelada"
              className="deleteButton"
              onClick={() => openReturnDialog(params)}
            >
              ⚠️Devolución
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
      if (!groupedData[month]) { groupedData[month] = { month, income: 0, expense: 0 }; }
      if (entry.type === "Ingreso") { groupedData[month].income += entry.amount;} 
      else if (entry.type === "Egreso") { groupedData[month].expense += entry.amount; }
    });
    setChartData(Object.values(groupedData));
  }, [data]);

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
          if (params.row.lodge?.user) {
            return `${params.row.lodge.user.first_name} ${params.row.lodge.user.last_name}`;
          }
          if (params.row.tent) {
            return `${params.row.tent.first_name} ${params.row.tent.last_name}`;
          }
          return "N/A";
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
    <CompletePaymentDialog
      open={isStatusDialogOpen}
      onClose={closeStatusOptions}
      selectedParams={selectedParams}
      remainingAmount={remainingAmount}
    />

    {/* Text Box para el comentario*/}
    <CommentDialog
       open={isDialogOpen}
       onClose={closeDialog}
       onSubmit={() => handleCommentSubmit(selectedParams)}
       text={maintenanceText}
       setText={setMaintenanceText}
      />

      <ReturnDepositDialog
        open={isReturnDialogOpen}
        onClose={closeReturnDialog}
        selectedParams={selectedParams}
      />

      <div className="chartButtons" style={{ marginTop: "3rem" }}>
      <ChartContainer 
         rawData={data} 
         processedData={processDataForChart(data)} 
         chartData={chartData}
         totalMoney={totalMoney}
         totalIncome={totalIncome}
         totalExpense={totalExpense}
       />
       </div>
    </div>
  );
};

export default Datatable;
