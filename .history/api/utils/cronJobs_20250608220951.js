import cron from "node-cron";
import { autoCancelPendingBookings } from "../controllers/booking.js";
import { checkPendingBookings, checkTodayCheckouts, deleteOldNotifications } from "../controllers/notification.js";

// Ejecutar todos los días a las 3:00 AM
cron.schedule(" * 3 * * *", async () => {
 
  console.log("Borrar notificaciones viejas");
  await deleteOldNotifications();


});