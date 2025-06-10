import cron from "node-cron";
import { autoCancelPendingBookings } from "../controllers/booking.js";
import { checkPendingBookings } from "../controllers/notification.js";

// Ejecutar todos los días a las 3:00 AM
cron.schedule("0 3 * * *", async () => {
  console.log("Ejecutando tarea programada: cancelar reservas pendientes");
  await autoCancelPendingBookings();
  console.log("Ejecutando tarea programada: avisos de seña faltante");
  await checkPendingBookings();
  console.log("Ejecutando tarea programada: ");
  await checkTodayCheckouts();

});