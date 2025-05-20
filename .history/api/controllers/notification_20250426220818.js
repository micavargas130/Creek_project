import Notifications from "../models/Notification.js"
import cron from "node-cron";

export const createNotification = async (req, res, next) => {
    const newNotification = new Notifications(req.body)  //body guarda la info de la cabaña 
    try{

        const savedNotification = await newNotification.save()
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



