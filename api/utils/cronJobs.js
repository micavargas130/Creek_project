import cron from "node-cron";
import { autoCancelPendingBookings } from "../controllers/booking.js";
import { checkPendingBookings, checkTodayCheckouts, deleteOldNotifications } from "../controllers/notification.js";

//ejecutar todos los días a las 3:00 AM (hora de Argentina; el servidor corre en UTC)
cron.schedule("0 3 * * *", async () => {
  //primero avisar de las señas faltantes y despues cancelar, si no el aviso nunca llega a crearse
  console.log("Ejecutando tarea programada: avisos de seña faltante");
  await checkPendingBookings();
  console.log("Ejecutando tarea programada: cancelar reservas pendientes");
  await autoCancelPendingBookings();
  console.log("Ejecutando tarea programada: avisos de checkouts");
  await checkTodayCheckouts();
  console.log("Borrar notificaciones viejas");
  await deleteOldNotifications();
}, { timezone: "America/Argentina/Buenos_Aires" });
