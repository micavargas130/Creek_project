import Notifications from "../models/Lodges.js"


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
        const lodges = await Lodges.find()
         res.status(200).json(lodges)
     }catch(err) {
         next(err)
     }

}


export const countByTitle = async (req, res, next) =>{
    const titles = req.query.titles.split(",")
    try{
        const list = await Promise.all(titles.map(name=>{
            return Lodges.countDocuments({name:name})
        }))
        res.status(200).json(list);
    }catch(err){
        next(err);
    }
};


// Funcion que retorna el arreglo de numeros de una habitacion en particular
export const updateLodgesAvailability = async (req, res, next) => {
    try {
    
      await Lodges.updateOne(
        { "_id": req.params.id },
        { $push: {"unavailableDates": req.body.dates }, }
      );
  
      res.status(200).json("Lodges status has been updated.");
    } catch (err) {
      next(err);
    }
  };

  export const deleteOccupiedBy = async (req, res, next) => {
    try {
      const lodgeId = req.params.id;
      console.log(lodgeId)
  
      await Lodges.updateOne(
        { _id: lodgeId },
        { $unset: { occupiedBy: 1 } }
      );
  
      res.status(200).json("Datos eliminados");
    } catch (err) {
      next(err);
    }
  };

  export const updateOccupiedBy = async (req, res, next) => {
    try {
    
      await Lodges.updateOne(
        { "_id": req.params.id },
        { "occupiedBy": req.body._id},
      );
  
      res.status(200).json("Lodges status has been updated.");
    } catch (err) {
      next(err);
    }
  };
  
  export const deleteLodgesAvailability = async (req, res, next) => {
    try {
    console.log(req.params.id)
    console.log(req.body.dates)
      await Lodges.updateOne(
        { "_id": req.params.id },
        { $pullAll: { "unavailableDates": req.body.dates}, }
      );
  
      res.status(200).json("Las fechas fueron eliminadas de la habitación");
    } catch (err) {
      next(err);
    }
  };


  export const setMantenimientoWithComment = async (req, res, next) => {
    try {
      const lodgeId = req.params.id;
      const { comment } = req.body;
  
      // Realiza la actualización en la base de datos
      const updatedLodge = await Lodges.findByIdAndUpdate(lodgeId, { state: 'Mantenimiento', comment }, { new: true });
  
      // Devuelve la cabaña actualizada como respuesta
      res.json(updatedLodge);
    } catch (error) {
      console.error('Error al poner la cabaña en mantenimiento con comentario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  export const eliminarComment = async (req, res, next) => {
    try {
    const lodgeId = req.params.id;

    // Elimina el comentario de mantenimiento y restablece el estado a 'Disponible' (o el estado que desees)
    const updatedLodge = await Lodges.findByIdAndUpdate(lodgeId, {comment: null }, { new: true });

    // Devuelve la cabaña actualizada como respuesta
    res.json(updatedLodge);
  } catch (error) {
    console.error('Error al eliminar el comentario de mantenimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

