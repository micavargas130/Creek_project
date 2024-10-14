import axios from "axios";
import { differenceInCalendarDays } from "date-fns";

const RoomItem = ({ item, updateBookingList }) => {

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
      dates.push(new Date(newDate)); // Agregar una copia de la fecha
      startDate.setDate(startDate.getDate() + 1);
    }

    // Aplicar el reemplazo a cada elemento del array
    const datesWithReplacement = dates.map((date) => {
      return date.toISOString().replace('T00:00:00.000Z', 'T03:00:00.000Z');
    });

    return datesWithReplacement;
  };

  const handleCancelClick = async () => {
    const today = new Date();
    const checkInDate = new Date(item.);

    const daysDifference = differenceInCalendarDays(checkInDate, today);

    if (daysDifference <= 1) {
      alert("No puede cancelar la reserva con menos de un día de antelación.");
      return;
    }

    try {
      await axios.delete(`/bookings/${item.id}`);

      const datesToDelete = getDatesInRange(item.checkIn, item.checkOut);
      await axios.put(`/lodges/delavailability/${item.place}`, {
        id: item.place,
        dates: datesToDelete,
      });

      alert("Reserva cancelada exitosamente");

      // Actualizar el estado en el componente padre para eliminar la reserva
      updateBookingList(item._id);
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  return (
    <div>
      {/* Render de la información de la reserva */}
      <div>
        <h2>{item.placeName}</h2>
        <p>{`Check-in: ${item.checkIn}`}</p>
        <p>{`Check-out: ${item.checkOut}`}</p>
        <button onClick={handleCancelClick}>Cancelar Reserva</button>
      </div>
    </div>
  );
};

export default RoomItem;
