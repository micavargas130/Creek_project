import Lodges from "../models/Lodges.js"

export const createLodge = async (req, res, next) => {
    const newLodge = new Lodges(req.body)  //body guarda la info de la cabaña 
    try{

        const savedLodge = await newLodge.save()
        res.status(200).json(savedLodge)


    }catch(err){
        next(err);
    }
}

export const updateLodge = async(req, res, next) =>{
    try{
        const updateLodge = await Lodges.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true})  
        res.status(200).json(updateLodge)
    }catch(err) {
        next(err);
    }
}

export const setOcupado = async(req, res, next) =>{
    try {
      const lodgeId = req.params.id;
  
      // Realiza la actualización en la base de datos
      const updatedLodge = await Lodges.findByIdAndUpdate(lodgeId, { state: 'Ocupado' }, { new: true });
  
      // Devuelve la cabaña actualizada como respuesta
      res.json(updatedLodge);
    } catch (error) {
      console.error('Error al marcar la cabaña como ocupada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  export const setDesocupada = async(req, res, next) =>{
    try {
      const lodgeId = req.params.id;
  
      // Realiza la actualización en la base de datos
      const updatedLodge = await Lodges.findByIdAndUpdate(lodgeId, { state: 'Desocupada' }, { new: true });
  
      // Devuelve la cabaña actualizada como respuesta
      res.json(updatedLodge);
    } catch (error) {
      console.error('Error al marcar la cabaña como ocupada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  export const setMantenimiento = async(req, res, next) =>{
    try {
      const lodgeId = req.params.id;
  
      // Realiza la actualización en la base de datos
      const updatedLodge = await Lodges.findByIdAndUpdate(lodgeId, { state: 'Mantenimiento' }, { new: true });
  
      // Devuelve la cabaña actualizada como respuesta
      res.json(updatedLodge);
    } catch (error) {
      console.error('Error al marcar la cabaña como ocupada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

export const deleteLodge = async(req, res, next) =>{
    try{
        await Lodges.findByIdAndUpdate(req.params.id) //busca el lodge con el id que le pasamos 
        res.status(200).json("Cabaña eliminada")
    }catch(err) {
        next(err);
    }
}

export const getLodge = async(req, res, next) =>{
    try{
        const lodge = await Lodges.findByIdAndUpdate(req.params.id) //busca el lodge con el id que le pasamos 
         res.status(200).json(lodge)
     }catch(err) {
        next(err);
     }
}

export const getLodges = async(req, res, next) =>{
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

  export const updateLodgesComment = async (req, res, next) => {
    try {
    
      await Lodges.updateOne(
        { "_id": req.params.id },
        { $push: {"unavailableDates": req.body.comment }, }
      );
  
      res.status(200).json("Lodges status has been updated.");
    } catch (err) {
      next(err);
    }
  };


