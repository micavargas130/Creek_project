/* eslint-disable react/prop-types */
import axios from "axios";
import { differenceInCalendarDays } from "date-fns";
import { useState, useEffect } from "react";
import { Chip } from "@mui/material";


export default function RoomItem({ item, updateBookingList }) {
  const [lodge, setLodge] = useState(null);

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

  const handleCancelClick = async () => {
    try {
      await axios.delete(`/bookings/${item._id}`);
      alert("Reserva cancelada exitosamente");
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
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-6 p-6 flex flex-col md:flex-row gap-6 border border-gray-200">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-primary mb-1">{item.placeName}</h2>
        <p className="text-lg text-gray-600 mb-2">{lodge ? lodge.name : "Cargando..."}</p>
        <div className="text-gray-500 space-y-1 text-sm">
          <p><strong>Check-in:</strong> {new Date(item.checkIn).toLocaleDateString("es-AR")}</p>
          <p><strong>Check-out:</strong> {new Date(item.checkOut).toLocaleDateString("es-AR")}</p>
          <p><strong>Estado:</strong>
              <Chip
                label={
                  item.status.status === "Pendiente"
                    ? "Pendiente: Esperando transferencia"
                    : item.status.status
                }
                color={
                  item.status.status === "Pendiente"
                    ? "warning"
                    : item.status.status === "Pagada"
                    ? "success"
                    : "default"
                }
                variant="outlined"
                size="small"
              />
            <p className="text-green-600 font-medium">
            Cancelación gratuita hasta {(() => {
              const date = new Date(item.checkOut);
              date.setDate(date.getDate() - 2);
              return date.toLocaleDateString("es-AR");
            })()}
          </p>
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-between text-right">
        <div>
          <p className="text-xl font-bold text-gray-800 mb-1">$ {item.totalAmount}</p>
          <p className="text-sm text-gray-400">Incluye impuestos y tasas</p>
        </div>
        <button
          className={`mt-4 py-2 px-4 rounded-full font-semibold text-white ${
            isCancellationAllowed ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleCancelClick}
          disabled={!isCancellationAllowed}
        >
          {isCancellationAllowed ? "Cancelar" : "Ya no es posible cancelar"}
        </button>
      </div>
    </div>
  );
}