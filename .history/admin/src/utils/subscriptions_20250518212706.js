import globalObserver from "./observer.js";
import axiosInstance from "../axios/axiosInstance.js";




// Suscripción para refrescar contabilidad
accountingObserver.subscribe("accountingChange", async () => {
  try {
    const res = await axiosInstance.get("/accounting");
    const event = new CustomEvent("updateAccountingData", { detail: res.data });
    window.dispatchEvent(event); // Dispara evento para que el componente escuche
  } catch (error) {
    console.error("Error al actualizar datos contables:", error);
  }
});

// Suscripción para actualizar los gráficos
globalObserver.subscribe("reserva-completada", ({ booking }) => {
  const event = new CustomEvent("updateCharts", { detail: { booking } });
  window.dispatchEvent(event);
});
