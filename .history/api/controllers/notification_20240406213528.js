import Notifications from "../models/Notification.js"


export const createNotification = async (req, res, next) => {
    const newNotification = new Notifications(req.body)  //body guarda la info de la cabaña 
    try{

        const savedNotification = await newLodge.save()
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

export const getNotifications = async(req, res, next) =>{
    try{
        const notifications = await Notifications.find()
         res.status(200).json(notifications)
     }catch(err) {
         next(err)
     }

}



