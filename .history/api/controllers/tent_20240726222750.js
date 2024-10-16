import Tents from "../models/Tents.js"

export const createTent = async (req, res, next) => {
    try {
      const newTent = new Tents({req.body)
      const { priceId, numberOfAdults, numberOfChildren, name, capacity } = req.body;
  
      // Asegúrate de que priceId sea proporcionado en la solicitud y luego busca el precio correspondiente.
      const price = await Price.findById(priceId);
      if (!price) {
        return res.status(404).json({ message: "Price not found" });
      }
  
      // Calcular el totalAmount
      const totalAmount = (numberOfAdults * price.priceAdult) + (numberOfChildren * price.priceChild);
  
      // Crear la nueva carpa (tent) con el totalAmount calculado
   
      const savedTent = await newTent.save();
      res.status(200).json(savedTent);
    } catch (err) {
      next(err);
    }
  };

export const updateTent = async(req, res, next) =>{
    try{
        const updateTent = await Tents.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true})  
        res.status(200).json(updateTent)
    }catch(err) {
        next(err);
    }
}

export const getTent = async(req, res, next) =>{
    try{
        const tent = await Tents.findByIdAndUpdate(req.params.id)  //busca la carpa con el id que le pasamos 

         res.status(200).json(tent)
     }catch(err) {
        next(err);
     }
}

export const getTents = async(req, res, next) =>{
    try{
        const tents = await Tents.find()
     //trae el lote en el que se encuentra la carpa

        res.status(200).json(tents)
     }catch(err) {
         next(err)
     }

}

export const getOccupiedPositions = async (req, res, next) => {
    try {
      const tents = await Tents.find();
      const occupiedPositions = tents.map((tent) => tent.location);
  
      res.status(200).json({ occupiedPositions });
    } catch (err) {
      next(err);
    }
  };

export const deleteTent = async(req, res, next) =>{
    try{
        await Tents.findByIdAndDelete(req.params.id) //busca el lodge con el id que le pasamos 
        res.status(200).json("Carpa eliminada")
    }catch(err) {
        next(err);
    }
}

export const setStatusCompleted = async(req, res, next) => {
    try {
        const tentId = req.params.id;
        // Realiza la actualización en la base de datos
        const updatedTent = await Tents.findByIdAndUpdate(
            tentId, 
            { 
                $set: { status: 'Completada' },
                $unset: { location: "" } // Borra el campo location
            },
            { new: true }
        );
        // Devuelve la cabaña actualizada como respuesta
        res.status(200).json(updatedTent);
    } catch (error) {
        console.error('Error al marcar la carpa como completada y borrar la ubicación', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}