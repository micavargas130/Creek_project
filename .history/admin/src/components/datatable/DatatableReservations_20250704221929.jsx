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
  const [bookings, setBookings] = useState([]);
  
  const fetchBookings = async () => {
    const res = await axiosInstance.get("/bookings");
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
    const handleReservationChange = () => {
    refetch(); // actualiza cuando cambia una reserva
  };
  
  reservationsObserver.subscribe("reservationCompleted", handleReservationChange);
  reservationsObserver.subscribe("reservationChange", handleReservationChange);
  

  return () => {
    reservationsObserver.unsubscribe("reservationChange", handleReservationChange);
     reservationsObserver.unsubscribe("reservationCompleted", handleReservationChange);
  };
  
  }, []);

  //filtro para mostrar solo las reservas con estado activo
  const filteredData = data.filter(item => item.status && (item.status.status === "Activa" || item.status.status === "Pendiente") );
  //ordenar reservas de más nuevas a más viejas según checkIn
  const sortedData = [...filteredData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
  
  //FUNCION PARA COBRARLE AL CLIENTE ()
  const handleArrivalClick = async (params) => {
    try {
      const lodgeId = params.row.lodge._id;
      const bookingId = params.row._id;
  
      //verificar estado de la cabaña
      const { data: lodgeStatus } = await axiosInstance.get(`/lodge_x_status/latest/${lodgeId}`);
  
      if (!lodgeStatus || !lodgeStatus.status) {
        //si no hay historial de estado, se asume disponible
      } else if (
        lodgeStatus.status.status === "ocupado" ||
        lodgeStatus.status.status === "mantenimiento"
      ) {
        alert("No se puede proceder con el cobro porque la cabaña está ocupada o en mantenimiento.");
        return;
      }
      //traer registro contable
      const { data: accounting } = await axiosInstance.get(`/accounting/booking/${bookingId}`);
      if (!accounting || !accounting.amount) {
        alert("No se encontró el registro contable o la seña.");
        return;
      }
      const restante = params.row.totalAmount - accounting.amount;
      setSelectedBooking(params.row);
      setAmountToPay(restante);
      setModalVisible(true);
    } catch (error) {
      console.error("Error al verificar el estado de la cabaña o cargar datos de pago:", error);
      alert("Hubo un problema. Intenta nuevamente.");
    }
  };

    const confirmFinishClick = async () => {
    const booking = selectedBooking;
    if (!booking) return;
    try {
      const bookingId = booking._id;
      let payment = 0;
      const { data: existingAccounting } = await axiosInstance.get(`/accounting/booking/${bookingId}`);

      if (selectedStatus === "pagada") {
        payment = existingAccounting.remainingAmount;
      } else if (selectedStatus === "parcial") {
        payment = partialPayment;
      } 
    
      if (!existingAccounting || !existingAccounting._id) {
        alert("No se encontró un registro contable para esta reserva.");
        return;
      }
      const paymentHistoryData = {
        accounting: existingAccounting._id,
        amount: payment,
        status: selectedStatus.toLowerCase()
      };
  
      await axiosInstance.post(`/accounting/pay/${existingAccounting._id}`, paymentHistoryData);
      await axiosInstance.put(`/bookings/${bookingId}/updateStatusCompleted`);
      reservationsObserver.notify("reservationCompleted", { booking });  
      reservationsObserver.notify("reservationChange");
      
      //para dar tiempo a que se actualicen los cambios en la lodge 
       navigate('/lodges');
      
    } catch (error) {
      console.error("Error al finalizar la reserva y registrar el pago:", error);
    } finally {
      setModalVisible(false);
    }
  };

  
  //FUNCION PARA QUE LA RESERVA SE PONGA ACTIVA
  const confirmActiveClick = async () => {
    const booking = selectedBooking;
    if (!booking) return;
  
    try {
      const bookingId = booking._id;
      const totalAmount = booking.totalAmount;
      const reservationAmount = (totalAmount * 0.3);
      //registro contable inicial 
      const paymentData = {
        amount: 0,
        totalAmount,
        type: "Ingreso",
        date: new Date().toISOString(),
        lodge: booking._id,
        remainingAmount: booking.totalAmount ,
        status: "seña"
      };
  
      await axiosInstance.put(`/bookings/${bookingId}/updateStatusActive`);
  
      const { data: accountingData } = await axiosInstance.post(`/accounting/createAccounting`, paymentData);
      //modifico el registro con el valor de la seña
      const paymentHistoryData = {
        accounting: accountingData._id,
        amount: reservationAmount,
        status: "seña"
      };
  
      await axiosInstance.post(`/accounting/pay/${accountingData._id}`, paymentHistoryData);
      reservationsObserver.notify("reservationChange");
    } catch (error) {
      console.error("Error al marcar la cabaña como ocupada y registrar el pago:", error);
    } finally {
      setModalVisible(false);
    }
  };
  
  const handleInfoClick = async (row) => {
    const currentStatus = row.status.status;  
    if (currentStatus === "Activa") {
      try {
        const res = await axiosInstance.get(`accounting/booking/${row._id}`);
        const accountingId = res.data._id;
        navigate(`/accounting/${accountingId}`);
      } catch (err) {
        console.error(err);
        alert("No se encontró información contable para esta reserva.");
      }
    } else if (currentStatus === "Pendiente") {
      const lodgeId = row.lodge?._id;
      if (lodgeId) {
        navigate(`/bookings/${row._id}`);
      } else { alert("No se encontró la cabaña asociada.");  }
    } else { alert("Solo se puede acceder a reservas activas o pendientes.");  }
  };
  
  const addNewButton = () => {
    navigate('new');
  };
  
  const actionColumn = [
    {
      width: 230,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        const isPending = params.row.status.status === "Pendiente";  
        return (
          <div className="cellAction">
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
              {isPending ? "Confirmar" : "Cobrar $"}
            </div>
            <div
              className="viewButton"
              onClick={() => handleInfoClick(params.row)}
            >
              Info
            </div>
           <div className="cancelButton" onClick={() => handleCancelClick(params)}>
              Cancelar
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

  const flattenedData = sortedData.map(item => ({
  ...item,
  clientFullName: `${item.user.first_name} ${item.user.last_name}`,
  lodgeName: item.lodge?.name || "Sin nombre",
  statusText: item.status?.status || "Sin estado"
  }));


  const lodgeNameColumn = [
  {
    field: "lodgeName",
    headerName: "Nombre de Cabaña",
    width: 150,
  },
];

  const statusColumn = [
    {
      field: "statusText",
      headerName: "Estado",
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
    field: "clientFullName",
    headerName: "Cliente",
    width: 150,
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
        rows={flattenedData}
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

