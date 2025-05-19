import globalObserver from "./observer";
import axiosInstance from "../axios/axiosInstance";

//actualizar el estado de la cabaña a completada
globalObserver.subscribe("reserva-completada", async ({ booking }) => {
  const lodgeId = booking.lodge._id;
  const bookingId = booking._id;

  try {
    // Actualizar estado actual
    await axiosInstance.put(`/lodges/${lodgeId}`, {
      state: "668f303c70711974d54762cf",
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

// Suscripción para refrescar contabilidad
globalObserver.subscribe("accountingChange", async () => {
  try {
    const res = await axiosInstance.get("/accounting");
    const event = new CustomEvent("updateAccountingData", { detail: res.data });
    window.dispatchEvent(event); // Dispara evento para que el componente escuche
  } catch (error) {
    console.error("Error al actualizar datos contables:", error);
  }
});

// Suscripción para actualizar los gráficos
globalObserver.subscribe("s", ({ booking }) => {
  const event = new CustomEvent("updateCharts", { detail: { booking } });
  window.dispatchEvent(event);
});
