import globalObserver from "./observer";
import axiosInstance from "../axios/axiosInstance";

//actualizar el estado de la cabaña a completada
globalObserver.subscribe("reserva-completada", async ({ booking }) => {
  try {
    const lodgeId = booking.lodge._id || booking.lodge; // Puede venir como objeto o ID

    const newStatus = new LodgeStatus({
      lodge: lodgeId,
      status: "disponible", // Se libera la cabaña al completar la reserva
      date: new Date()
    });

    await newStatus.save();
    console.log(`Estado actualizado a 'disponible' para cabaña ${lodgeId}`);
  } catch (err) {
    console.error("Error actualizando estado de la cabaña:", err.message);
  }
});

// Suscripción para actualizar los gráficos
globalObserver.subscribe("reserva-completada", ({ booking }) => {
  const event = new CustomEvent("updateCharts", { detail: { booking } });
  window.dispatchEvent(event);
});
