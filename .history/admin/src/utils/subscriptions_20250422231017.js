// subscriptions.js
import { subscribe } from "./observer";
import axiosInstance from "../axios/axiosInstance";

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



// Suscripción 2: Actualiza gráficos
subscribe("reserva-completada", async ({ booking }) => {
  // Esta parte depende de cómo estás manejando los gráficos.
  // Si usás algún estado global o cache local de datos, ahí lo actualizás.
  // Si simplemente querés recargar desde el servidor:
  const event = new CustomEvent("updateCharts", { detail: { booking } });
  window.dispatchEvent(event);
});
