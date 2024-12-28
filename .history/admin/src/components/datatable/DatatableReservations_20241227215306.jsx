import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource.js";
import { Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";

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
      dates.push(newDate); // Agregar una copia de la fecha
      startDate.setDate(startDate.getDate() + 1);
    }

    // Aplicar el reemplazo a cada elemento del array
    const datesWithReplacement = dates.map((date) => {
      return date.toISOString().replace('T00:00:00.000Z', 'T03:00:00.000Z');
    });

    return datesWithReplacement;
  };

  const handleCancelClick = async (params) => {
    try {
      // Cambia el estado de la reserva a cancelado
      await axios.put(`/bookings/${params.row._id}/updateStatusCanceled`);
      // Libera las fechas que habían sido reservadas
      const datesToDelete = getDatesInRange(params.row.checkIn, params.row.checkOut);
      await axios.put(`/lodges/delavailability/${params.row.lodge}`, {
        id: params.row.lodge,
        dates: datesToDelete
      });
      // Actualiza la tabla de datos después de cancelar la reserva
      window.location.reload();
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const handleArrivalClick = async (params) => {
    // Al hacer clic en el botón de llegada, guarda la reserva seleccionada
    setSelectedBooking(params.row);
    //pone en Amount el valor a pagar 
    const checkInDate = new Date(params.row.checkIn);
    const checkOutDate = new Date(params.row.checkOut);
    const daysDifference = Math.round((checkOutDate - checkInDate) / (1000 * 3600 * 24));
    if daysDifference
    // Update state with total price and days
    setAmountToPay((params.row.totalAmount * daysDifference));
    // Abre el modal para seleccionar el estado de pago
    setModalVisible(true);
  };

  // Mueve la función confirmFinishClick fuera de renderCell
  const confirmFinishClick = async () => {
    const booking = selectedBooking;
    if (!booking) return;

    try {
      // Obtener el ID de la reserva y la cabaña
      const bookingId = booking._id;
      const lodgeId = booking.lodge._id;

      // Marcar la cabaña como "Ocupado" y actualizar el campo "occupiedBy"
      await axios.put(`/lodges/set-occupied/${lodgeId}`, { _id: bookingId });

      let payment = 0;

      console.log("totalAmount",booking.totalAmount);
      // Determinar el valor de payment según el estado seleccionado
      if (selectedStatus === "pagada") {
        payment = (amountToPay); // Pago completo
        } else if (selectedStatus === "parcial") {
        payment = partialPayment; // Pago parcial ingresado por el usuario
        } else if (selectedStatus === "pendiente"){
        payment = 0; //el usuario no pago nada
        }

        
        console.log("status",selectedStatus)

      const paymentData = {
        amount: payment,
        totalAmount: amountToPay,
        type: "Ingreso",
        date: new Date().toISOString(), // Fecha actual
        user: booking.user._id,
        lodge: booking._id, //en lodge guardo booking 
        remainingAmount:  (amountToPay - partialPayment),
        comment: "",
        status: selectedStatus.toLowerCase() // Estado seleccionado (pagada, parcial, pendiente)
      };

      
      // Se marca la reserva como Completa
      await axios.put(`/bookings/${bookingId}/updateStatusCompleted`);

      await axios.put(`lodge_x_status/`, {
        lodge: lodgeId,
        status: "668f303c70711974d54762cf",
        booking: bookingId
      });

      // Se guarda el nuevo ingreso en la tabla de ingresos
      await axios.post(`/accounting/createAccounting`, paymentData);

      // Redirige a la página de cabañas
      navigate('/lodges');
    } catch (error) {
      console.error("Error al marcar la cabaña como ocupada y registrar el pago:", error);
    } finally {
      // Cierra el modal
      setModalVisible(false);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
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
              ✔
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

