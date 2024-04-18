import Notifications from "../models/Notification.js"


export const createNotification = async (req, res, next) => {
    const newNotification = new Notifications(req.body)  //body guarda la info de la cabaña 
    try{

        const savedNotification = await newNotification.save()
        res.status(200).json(savedNotification)


    }catch(err){
        next(err);
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
    try{
        const notification = await Notifications.findByIdAndUpdate(req.params.id) //busca el lodge con el id que le pasamos 
         res.status(200).json(notification)
     }catch(err) {
        next(err);
     }
}

export const updateNotification = async (req, res, next) => {
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
        const notifications = await Notifications.find()
         res.status(200).json(notifications)
     }catch(err) {
         next(err)
     }

}



