import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource.js";
import { Link, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch.js";
import axiosInstance from "../../axios/axiosInstance.js"
import reservationsObserver from "../../utils/observer.js"; 
import SelectPaymentStatus from "../../components/props/selectPaymentStatus.jsx";

const Datatable = () => {
  const { data, loading, error, refetch } = useFetch("/bookings");
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pagada");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [partialPayment, setPartialPayment] = useState([]);
  const [amountToPay, setAmountToPay] = useState([]);
  const [showDepositSummary, setShowDepositSummary] = useState(false);
  
  useEffect(() => {
    const onReservationChange = () => {
      refetch(); // Esto vuelve a pedir los datos sin recargar la página
    };
    reservationsObserver.subscribe("reservationChange", onReservationChange);
    return () => {
      reservationsObserver.unsubscribe("reservationChange", onReservationChange);
    };
  }, [refetch]);

  // Filtro para mostrar solo las reservas con estado activo
  const filteredData = data.filter(item => item.status && (item.status.status === "Activa" || item.status.status === "Pendiente") );

  const handleCancelClick = async (params) => {
    const confirmCancel = window.confirm("¿Estás seguro de que quieres cancelar esta reserva?");
    if (!confirmCancel) return; 
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
      const bookingId = params.row._id;
  
      // Verificar estado de la cabaña
      const { data: lodgeStatus } = await axiosInstance.get(`/lodge_x_status/latest/${lodgeId}`);
  
      if (!lodgeStatus || !lodgeStatus.status) {
        // Si no hay historial de estado, se asume disponible
      } else if (
        lodgeStatus.status.status === "ocupado" ||
        lodgeStatus.status.status === "mantenimiento"
      ) {
        alert("No se puede proceder con el cobro porque la cabaña está ocupada o en mantenimiento.");
        return;
      }
  
      const { data: accounting } = await axiosInstance.get(`/accounting/booking/${bookingId}`);
      if (!accounting || !accounting.amount) {
        alert("No se encontró el registro contable o la seña.");
        return;
      }

      console.log("amount", params.row.totalAmount)
      const restante = params.row.totalAmount - accounting.amount;
  
      setSelectedBooking(params.row);
      setAmountToPay(restante);
      setModalVisible(true);
    } catch (error) {
      console.error("Error al verificar el estado de la cabaña o cargar datos de pago:", error);
      alert("Hubo un problema. Intenta nuevamente.");
    }
  };
  

  const confirmActiveClick = async () => {
    const booking = selectedBooking;
    if (!booking) return;
  
    try {
      const bookingId = booking._id;
      const totalAmount = booking.totalAmount;
      const reservationAmount = totalAmount * 0.3;
  
      const paymentData = {
        amount: 0,
        totalAmount,
        type: "Ingreso",
        date: new Date().toISOString(),
        lodge: booking._id,
        remainingAmount: totalAmount - reservationAmount,
        status: "seña"
      };
  
      await axiosInstance.put(`/bookings/${bookingId}/updateStatusActive`);
      reservationsObserver.notify("reserva-completada", { booking });
  
      const { data: accountingData } = await axiosInstance.post(`/accounting/createAccounting`, paymentData);
  
      const paymentHistoryData = {
        accounting: accountingData._id,
        amount: reservationAmount,
        status: "seña"
      };
  
      await axiosInstance.post(`/accounting/pay/${accountingData._id}`, paymentHistoryData);
    } catch (error) {
      console.error("Error al marcar la cabaña como ocupada y registrar el pago:", error);
    } finally {
      setModalVisible(false);
    }
  };
  
  // Mueve la función confirmFinishClick fuera de renderCell
  const confirmFinishClick = async () => {
    const booking = selectedBooking;
    if (!booking) return;
  
    try {
      const bookingId = booking._id;
      let payment = 0;
      const totalAmount = booking.totalAmount;
  
      if (selectedStatus === "pagada") {
        payment = totalAmount;
      } else if (selectedStatus === "parcial") {
        payment = partialPayment;
      } else if (selectedStatus === "pendiente") {
        payment = 0;
      }
  
      const { data: existingAccounting } = await axiosInstance.get(`/accounting/booking/${bookingId}`);
  
      if (!existingAccounting || !existingAccounting._id) {
        alert("No se encontró un registro contable para esta reserva.");
        return;
      }
  
      const paymentHistoryData = {
        accounting: existingAccounting._id,
        amount: existingAccounting,
        status: selectedStatus.toLowerCase()
      };
  
      await axiosInstance.post(`/accounting/pay/${existingAccounting._id}`, paymentHistoryData);
  
      await axiosInstance.put(`/bookings/${bookingId}/updateStatusCompleted`);
      reservationsObserver.notify("reserva-completada", { booking });
  
      navigate('/lodges');
    } catch (error) {
      console.error("Error al finalizar la reserva y registrar el pago:", error);
    } finally {
      setModalVisible(false);
    }
  };
  
  const addNewButton = () => { navigate('new');};

  const actionColumn = [
    {
      width: 230,
      renderCell: (params) => {
        const isPending = params.row.status.status === "Pendiente";
  
        return (
          <div className="cellAction">
            <Link to={`/bookings/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Info</div>
            </Link>
            <div className="deleteButton" onClick={() => handleCancelClick(params)}>
              Cancelar
            </div>
            <div
              className="arrivalButton"
              onClick={() => {
                if (isPending) {
                  setSelectedBooking(params.row);
                  setShowDepositSummary(true); // Mostramos el resumen
                } else {
                  handleArrivalClick(params); // Botón "Cobrar"
                }
              }}
            >
              {isPending ? "Confirmar" : "Cobrar"}
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
      width: 150,
      renderCell: (params) => {
        return (  <div className="cellAction">{params.row.lodge.name}  </div> );
      },
    },
  ];

  const statusColumn = [
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div className={`cellStatus ${params.row.status.status}`}>
              {params.row.status.status}
            </div>
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
        columns={[...namesColumn, ...lodgeNameColumn, ...userColumns,...statusColumn, ...actionColumn]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
        loading={loading}
        error={error}
      />
      {modalVisible && (
        <SelectPaymentStatus
          amountToPay={amountToPay}
          selectedStatus={selectedStatus}
          partialPayment={partialPayment}
          setSelectedStatus={setSelectedStatus}
          setPartialPayment={setPartialPayment}
          onConfirm={confirmFinishClick}
          onCancel={() => setModalVisible(false)}
        />
      )}

      {showDepositSummary && selectedBooking && (
        <div className="modal">
          <div className="modalContent">
            <h2>Resumen de seña</h2>
            <p><strong>Cliente:</strong> {selectedBooking.user.first_name} {selectedBooking.user.last_name}</p>
            <p><strong>Total de la reserva:</strong> ${selectedBooking.totalAmount}</p>
            <p><strong>Seña (30%):</strong> ${Math.round(selectedBooking.totalAmount * 0.3)}</p>
            <p><strong>Saldo restante:</strong> ${Math.round(selectedBooking.totalAmount * 0.7)}</p>
            <button
              onClick={() => {
                confirmActiveClick(); // Tu lógica para actualizar el estado
                setShowDepositSummary(false); // Cerramos el modal
              }}
            >
              Confirmar
            </button>
            <button onClick={() => setShowDepositSummary(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datatable;

