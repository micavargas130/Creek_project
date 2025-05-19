// subscriptions.js
import { subscribe } from "./observer";
import axiosInstance from "/../axios/axiosInstance";

subscribe("reserva-completada", async ({ booking }) => {
  const lodgeId = booking.lodge._id;
  const bookingId = booking._id;

  await axiosInstance.put(`/lodges/${lodgeId}`, {
    state: "668f303c70711974d54762cf",
  });

  // Cambiar el estado de la cabaña a "disponible" o "finalizada"
  await axiosInstance.post(`lodge_x_status/`, {
    lodge: lodgeId,
    status: "668f303c70711974d54762cf", // ID del estado "disponible"
    booking: bookingId,
  });
});
