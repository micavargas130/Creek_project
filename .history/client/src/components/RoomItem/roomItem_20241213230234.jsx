/* eslint-disable react/prop-types */

import axios from "axios";
import { differenceInCalendarDays } from "date-fns";
import { useState, useEffect } from "react";

export default function RoomItem({ item, updateBookingList }) {
  const [lodge, setLodge] = useState(null);

  // Obtener información del lodge al cargar el componente
  useEffect(() => {
    const fetchLodge = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/lodges/${item.lodge}`);
        setLodge(response.data);
      } catch (error) {
        console.error("Error fetching lodge data:", error);
      }
    };
    fetchLodge();
  }, [item.lodge]);

  const getDatesInRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];

    while (startDate <= endDate) {
      dates.push(new Date(startDate).toISOString().replace("T00:00:00.000Z", "T03:00:00.000Z"));
      startDate.setDate(startDate.getDate() + 1);
    }

    return dates;
  };

  const handleCancelClick = async () => {
    try {
      // Eliminar la reserva
      await axios.delete(`/bookings/${item._id}`);

      // Actualizar disponibilidad del lodge
      const datesToDelete = getDatesInRange(item.checkIn, item.checkOut);
      await axios.put(`/lodges/delavailability/${item.place}`, {
        id: item.place,
        dates: datesToDelete,
      });

      alert("Reserva cancelada exitosamente");

      // Actualizar la lista de reservas en el componente padre
      updateBookingList(item._id);
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const today = new Date();
  const checkInDate = new Date(item.checkIn);
  const daysDifference = differenceInCalendarDays(checkInDate, today);

  const isCancellationAllowed = daysDifference > 1;

  return (
    <div className="searchItem">
      <div className="siDesc">
        <h1 className="siTitle">{item.placeName}</h1>
        <span className="siSubtitle">{lodge ? lodge.name : "Cargando..."}</span>
        <span className="siFeatures">Check-in: {item.checkIn}</span>
        <span className="siFeatures">Check-out: {item.checkOut}</span>
        <span className="siCancelOp">Free cancellation</span>
      </div>
      <div className="siDetails">
        <div className="siDetailTexts">
          <span className="siPrice">$ {item.totalAmount}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button 
            className="siCheckButton" 
            onClick={handleCancelClick} 
            disabled={!isCancellationAllowed}
          >
            {isCancellationAllowed ? "Cancel" : "Ya no es posible cancelar"}
          </button>
        </div>
      </div>
    </div>
  );
}

