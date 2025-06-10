import cron from "node-cron";
import { autoCancelPendingBookings } from "../controllers/booking.js";
import { checkPendingBookings, checkTodayCheckouts, deleteOldNotifications } from "../controllers/notification.js";

// Ejecutar todos los días a las 3:00 AM
cron.schedule(" *  * * *", async () => {
  console.log("Ejecutando tarea programada: cancelar reservas pendientes");
  await autoCancelPendingBookings();
  console.log("Ejecutando tarea programada: avisos de seña faltante");
  await checkPendingBookings();
  console.log("Ejecutando tarea programada: avisos de checkouts");
  await checkTodayCheckouts();
  console.log("Borrar notificaciones viejas");
  await deleteOldNotifications();
});