import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource.js";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";

const Datatable = () => {
  const { data, loading, error } = useFetch("/bookings");
  const [userInLodge, setUserInLodge] = useState(null);
  const navigate = useNavigate();

  // Estado del modal de confirmación de pago
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pagada");
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  /* BOTON DE CANCELACION */
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

  /* BOTON DE LLEGADA */
  const handleArrivalClick = async (params) => {
    // Al hacer clic en el botón de llegada, guarda la reserva seleccionada
    setSelectedBooking(params.row);
    // Abre el modal para seleccionar el estado de pago
    setModalVisible(true);
  };

  const confirmFinishClick = async () => {
    const booking = selectedBooking;
    if (!booking) return;

    try {
      // Obtener el ID de la reserva y la cabaña
      const bookingId = booking._id;
      const lodgeId = booking.lodge._id;

      // Marcar la cabaña como "Ocupado" y actualizar el campo "occupiedBy"
      await axios.put(`/lodges/set-occupied/${lodgeId}`, { _id: bookingId });

      // Se crea un nuevo ingreso con el estado seleccionado
      const paymentData = {
        amount: booking.totalAmount,
        type: "Ingreso",
        date: new Date().toISOString(), // Fecha actual
        user: booking.user,
        lodge: bookingId,
        comment: "",
        status: selectedStatus.toLowerCase() // Estado seleccionado (pagada, parcial, pendiente)
      };

      // Se marca la reserva como Completa
      await axios.put(`/bookings/${bookingId}/updateStatusCompleted`);

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

  
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Reservaciones
      </div>
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={[...userColumns, ...actionColumn]}
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
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="pagada">Pagada</option>
              <option value="parcial">Parcial</option>
              <option value="pendiente">Pendiente</option>
            </select>
            <button onClick={confirmFinishClick}>Confirmar</button>
            <button onClick={() => setModalVisible(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datatable;
