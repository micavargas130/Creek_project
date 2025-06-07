import cron from "node-cron";
import { autoCancelPendingBookings } from "./tasks/autoCancelBookings.js";

// Ejecutar todos los días a las 3:00 AM
cron.schedule("0 3 * * *", async () => {
  console.log("Ejecutando tarea programada: cancelar reservas pendientes");
  await autoCancelPendingBookings();
  console.log("Ejecutando tarea programada: avisos de ");
  await checkPendingBookings();

});