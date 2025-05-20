
import globalObserver from "./observer";
import axiosInstance from "../axios/axiosInstance";

// Suscripción para actualizar el estado de la cabaña
globalObserver.subscribe("reserva-completada", async ({ booking }) => {
  const lodgeId = booking.lodge._id;
  const bookingId = booking._id;

  try {
    // Actualizar estado actual
    await axiosInstance.put(`/lodges/${lodgeId}`, {
      state: "668f303c70711974d54762cf", // Estado 'disponible'
    });

    // Crear nuevo estado en historial
    await axiosInstance.post(`/lodge_x_status/`, {
      lodge: lodgeId,
      status: "668f303c70711974d54762cf",
      booking: bookingId,
    });

    console.log("Estado de la cabaña actualizado exitosamente.");
  } catch (error) {
    console.error("Error actualizando estado de cabaña:", error);
  }
});

// Suscripción para actualizar los gráficos
globalObserver.subscribe("reserva-completada", ({ booking }) => {
  const event = new CustomEvent("updateCharts", { detail: { booking } });
  window.dispatchEvent(event);
});
