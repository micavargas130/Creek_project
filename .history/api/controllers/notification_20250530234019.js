import Notifications from "../models/Notification.js"
import cron from "node-cron";
import Bookings from "../models/Bookings.js";
import Tents from "../models/Tents.js";
import moment from "moment";

export const createNotification = async (req, res, next) => {
    const newNotification = new Notifications(req.body)  //body guarda la info de la cabaña 
    try{

        const savedNotification = await newNotification.save()
        console.log(savedNotification)
        res.status(200).json(savedNotification)


    }catch(err){
        next(err);
    }
}

export const closeNotification = async (req, res) => {
    const { userId } = req.body;
    const { notificationId } = req.params;
    try {
        const notification = await Notifications.findByIdAndUpdate(notificationId, {
            $addToSet: { closedBy: userId } // Usar addToSet para evitar duplicados
        }, { new: true });
        res.send(notification);
    } catch (error) {
        res.status(500).send("Error closing notification: " + error);
    }
}

export const getClosedNotification = async (req, res) => {
    try {
        const notifications = await Notifications.find({
            closedBy: { $ne: req.params.userId } // Asegúrate de usar req.params.userId
        });
        res.send(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).send("Error fetching notifications: " + error);
    }
}

export const updateNotification = async(req, res, next) =>{
    try{
        const updateNotification = await Notifications.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true})  
        res.status(200).json(updateNotification)
    }catch(err) {
        next(err);
    }
}

export const deleteNotification = async(req, res, next) =>{
    try{
        await Lodges.findByIdAndDelete(req.params.id) //busca el lodge con el id que le pasamos 
        res.status(200).json("Notificacion eliminada")
    }catch(err) {
        next(err);
    }
}

export const getNotification = async(req, res, next) =>{
    try {

      checkTodayCheckouts();  
      deleteOldNotifications();

        const notification = await Notifications.findById(req.params.id);
        if (!notification) {
            return res.status(404).json("Notification not found");
        }
        res.status(200).json(notification);
    } catch(err) {
        next(err);
    }
}

export const updateNotificationViewing = async (req, res, next) => {
    try {
      const { id } = req.params.id;
      const { closed } = req.body;
  
      // Busca la notificación por su ID en la base de datos
      const notification = await Notification.findById(id);
  
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
  
      // Actualiza el estado de closed
      notification.closed = closed;
      // Guarda los cambios en la base de datos
      await notification.save();
  
      // Retorna la notificación actualizada
      res.status(200).json(notification);
    } catch (error) {
      next(error);
    }
  }

export const getNotifications = async(req, res, next) =>{
    try{
        deleteOldNotifications();
        const notifications = await Notifications.find()
         res.status(200).json(notifications)
     }catch(err) {
         next(err)
     }

}

export const deleteOldNotifications = async () => {
    try {
      const fourDaysAgo = new Date();
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
  
      const result = await Notifications.deleteMany({ createdAt: { $lt: fourDaysAgo } });
      console.log(`🗑️ Notificaciones eliminadas: ${result.deletedCount}`);
    } catch (error) {
      console.error("❌ Error eliminando notificaciones antiguas:", error);
    }
  };
  
  cron.schedule("0 0 * * *", async () => {
    console.log("🔄 Ejecutando eliminación de notificaciones viejas...");
    await deleteOldNotifications();
    console.log("✅ Proceso de eliminación completado.");
  });
  
  // Función que crea notificaciones de checkout
  export const checkTodayCheckouts = async () => {
    try {
      const today = moment().startOf('day').toDate(); // Hoy a las 00:00
      const tomorrow = moment(today).add(1, 'day').toDate(); // Mañana a las 00:00
  
      // Buscar reservas de cabañas con checkout hoy
      const lodgeBookings = await Bookings.find({
        "checkOut": { $gte: today, $lt: tomorrow }
      }).populate("lodge").populate("user");

      console.log(lodgeBookings);
  
      // Buscar carpas con checkout hoy
      const tentBookings = await Tents.find({
        "checkOut": { $gte: today, $lt: tomorrow }
      });
  
      // Crear notificaciones para cabañas
      for (const booking of lodgeBookings) {
        const fullName = `${booking.user.first_name} ${booking.user.last_name}`;
        const lodgeName = booking.lodge.name;
  
        const notification = new Notifications({
          type: "Checkout",
          cabain: booking.lodge._id,
          client: booking.user._id,
          date: new Date(),
        });

  
        await notification.save();
      }
  
      // Crear notificaciones para carpas
      for (const tent of tentBookings) {
        const fullName = `${tent.first_name} ${tent.last_name}`;
  
        const notification = new Notifications({
          type: "Aviso de Checkout",
          cabain: lodgeBookings.lodge._id,
          client: lodgeBookings.user._id,
          date: new Date(),

        });
  
        await notification.save();
      }
  
      console.log("✅ Notificaciones de check-out generadas.");
    } catch (error) {
      console.error("❌ Error generando notificaciones de check-out:", error);
    }
  };
  
  export const checkTodayRoute = async (req, res) => {
  console.log("🌐 Ruta /try ejecutada");
  try {
    res.status(200).send("🔔 Notificaciones de check-out generadas.");
  } catch (error) {
    console.error("❌ Error en la ruta /try:", error);
    res.status(500).send("❌ Error generando notificaciones.");
  }
};

export const createCancellationNotification = async (bookingId, isTent = false) => {
  try {
    if (isTent) {
      const tent = await Tents.findById(bookingId);
      if (!tent) return;

      const fullName = `${tent.first_name} ${tent.last_name}`;

      const notification = new Notifications({
        type: "Cancelación de carpa",
        clientName: fullName,
        client: null,
        cabain: null,
        date: new Date(),
      });

      await notification.save();
    } else {
      const booking = await Bookings.findById(bookingId).populate("user").populate("lodge");
      if (!booking) return;

      const fullName = `${booking.user.first_name} ${booking.user.last_name}`;

      const notification = new Notifications({
        type: "Cancelación de cabaña",
        cabain: booking.lodge._id,
        client: booking.user._id,
        clientName: fullName,
        date: new Date(),
      });

      await notification.save();
    }

    console.log("🔔 Notificación de cancelación creada.");
  } catch (error) {
    console.error("❌ Error creando notificación de cancelación:", error);
  }
};

