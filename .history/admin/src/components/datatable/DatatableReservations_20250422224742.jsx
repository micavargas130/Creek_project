import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource.js";
import { Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axiosInstance from "../../axios/axiosInstance.js"
import reservationsObserver from "../../utils/observer.js"; // al inicio del archivo

const Datatable = () => {
  const { data, loading, error } = useFetch("/bookings");
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pagada");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [partialPayment, setPartialPayment] = useState([]);
  const [amountToPay, setAmountToPay] = useState([]);
  
  // Filtro para mostrar solo las reservas con estado activo
  const filteredData = data.filter(item => item.status && item.status.status === "Activa");

  const handleCancelClick = async (params) => {
    const confirmCancel = window.confirm("¿Estás seguro de que quieres cancelar esta reserva?");
    if (!confirmCancel) return; // Si el usuario elige "No", se detiene la acción
    try {
      await axiosInstance.put(`/bookings/${params.row._id}/updateStatusCanceled`);
      reservationsObserver.notify("reservationChange"); // Recarga la página para reflejar los cambios
    } catch (error) {
      console.error("Error cancelando la reserva:", error);
    }
  };
  
  const handleArrivalClick = async (params) => {
    try {
      const lodgeId = params.row.lodge._id;
      console.log("aca1")

    // Verificar el estado actual de la cabaña antes de continuar
    const { data: lodgeStatus } = await axiosInstance.get(`/lodge_x_status/latest/${lodgeId}`);
    console.log(lodgeStatus)

     //Si no hay historial, permitir avanzar (considera que está "disponible")
     if (!lodgeStatus || !lodgeStatus.status) {
       setSelectedBooking(params.row);
       setAmountToPay(params.row.totalAmount);
       setModalVisible(true);
       console.log("aca")
       return;
     }
     //Si hay estado, verificar normalmente
     if (
       lodgeStatus.status.status === "ocupado" ||
       lodgeStatus.status.status === "mantenimiento"
        ) { alert("No se puede proceder con el cobro porque la cabaña está ocupada o en mantenimiento.");
           return;
          }
          setSelectedBooking(params.row);
          setAmountToPay(params.row.totalAmount);
          setModalVisible(true);
          console.log("aca")
          return;

    } catch (error) {
      console.error("Error al verificar el estado de la cabaña:", error);
      alert("Hubo un problema al verificar el estado de la cabaña. Inténtalo de nuevo.");
    }
  };
  
  // Mueve la función confirmFinishClick fuera de renderCell
  const confirmFinishClick = async () => {
    const booking = selectedBooking;
    if (!booking) return;

    try {
      // Obtener el ID de la reserva y la cabaña
      const bookingId = booking._id;
      let payment = 0;
      const totalAmount = booking.totalAmount; // Ahora lo obtenemos desde la API

    // Determinar el valor de payment según el estado seleccionado
    if (selectedStatus === "pagada") {
      payment = totalAmount; // Pago completo
      } else if (selectedStatus === "parcial") {
      payment = partialPayment; // Pago parcial ingresado por el usuario
      } else if (selectedStatus === "pendiente") {
      payment = 0; // el usuario no pagó nada
      }

    const paymentData = {
      amount: 0,
      totalAmount, 
      type: "Ingreso",
      date: new Date().toISOString(),
      lodge: booking._id,
      user: booking.user,
      remainingAmount: totalAmount,
      status: selectedStatus.toLowerCase(),
     };
      
      // Se marca la reserva como Completa
      await axiosInstance.put(`/bookings/${bookingId}/updateStatusCompleted`);
      await reservationsObserver.notify("reservationChange", data); //notifica a la cabaña para que cambie de estado

      //crea el registro de accounting que se podra actualizar
      const { data: accountingData } = await axiosInstance.post(`/accounting/createAccounting`, paymentData); 

      // Ahora, crea un pago en el historial de pagos
      const paymentHistoryData = {
        accounting: accountingData._id, // ID del accounting recién creado
        amount: payment, // Monto del pago inicial
        status: selectedStatus.toLowerCase(), // Estado del pago
      };

      // Guarda el pago en el historial
      await axiosInstance.post(`/accounting/pay/${accountingData._id}`, paymentHistoryData); 

      // Redirige a la página de cabañas
      navigate('/lodges');
    } catch (error) {
      console.error("Error al marcar la cabaña como ocupada y registrar el pago:", error);
    } finally {
      // Cierra el modal
      setModalVisible(false);
    }
  };

  const addNewButton = () => {
    navigate('new');
  };

  const actionColumn = [
    {
      width: 350,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/bookings/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Info</div>
            </Link>
            <div className="deleteButton" onClick={() => handleCancelClick(params)}>
              Cancelar
            </div>
            <div className="arrivalButton" onClick={() => handleArrivalClick(params)}>
              Cobrar
            </div>
          </div>
        );
      },
    },
  ];

  // Botón que lleva al registro histórico
  const handleHistoricButton = async () => {
    try {
      navigate('historic');
    } catch (error) {
      console.error("Error navigating to historic bookings:", error);
    }
  };

  const lodgeNameColumn = [
    {
      field: "lodge",
      headerName: "Nombre de Cabaña",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {params.row.lodge.name}
          </div>
        );
      },
    },
  ];

  const namesColumn = [
    {
      field: "client",
      headerName: "Cliente",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="clientInfo">
            {params.row.user.first_name} {params.row.user.last_name}
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Reservaciones
      </div>
      <button className="styleButtons historyButton" onClick={handleHistoricButton}> Historia</button>
      <button className="styleButtons addButton" onClick={addNewButton}>Nueva Reserva </button>
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={[...namesColumn, ...lodgeNameColumn, ...userColumns, ...actionColumn]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
        loading={loading}
        error={error}
      />

     {modalVisible && (
        <div className="modal">
          <div className="modalContent">
            <h2>Seleccionar estado del pago</h2>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="pagada">Pagada</option>
              <option value="parcial">Parcial</option>
              <option value="pendiente">Pendiente</option>
            </select>
            {selectedStatus === "parcial" && (
             <div>
              <p>Monto asignado: {amountToPay}</p>
             <label htmlFor="partialPayment">Monto entregado:</label>
             <input
               type="number"
               id="partialPayment"
               placeholder="Ingrese monto parcial"
               value={partialPayment || ""}
               onChange={(e) => {
                 const value = Number(e.target.value);
                 const totalToPay = amountToPay;
                 if (value > totalToPay) {
                   alert("El monto no puede ser mayor al total a pagar.");
                 } else {
                   setPartialPayment(value);
                 }
               }}
             />
           </div>
           )}
            {selectedStatus !== "parcial" && (
              <p>Monto asignado: {amountToPay}</p>
            )}
            <button onClick={confirmFinishClick}>Confirmar</button>
            <button onClick={() => setModalVisible(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datatable;

