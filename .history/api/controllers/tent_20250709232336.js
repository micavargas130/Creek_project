import Tents from "../models/Tents.js"
import Status from '../models/BookingsStatus.js';
import Price from '../models/Prices.js';

export const createTent = async (req, res, next) => {
    try {
        const { numberOfAdults, numberOfChildren, checkIn, checkOut } = req.body;
        const status = await Status.findOne({ status: "Activa" });

        // Obtener el último precio ingresado para carpas
        const price = await Price.findOne({ category: "carpas" }).sort({ createdAt: -1 });
        if (!price) {
            return res.status(404).json({ message: "No hay precios disponibles para carpas" });
        }

        // Convertir checkIn y checkOut a fechas
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        // Calcular la diferencia de días
        const timeDifference = checkOutDate - checkInDate;
        const daysDifference = Math.round(timeDifference / (1000 * 3600 * 24));

        if (daysDifference <= 0) {
            return res.status(400).json({ message: "La fecha de check-out debe ser posterior a la de check-in" });
        }

        // Calcular el monto total basado en la cantidad de días
        const paymentAmount = ((numberOfAdults * price.priceAdult) + (numberOfChildren * price.priceChild)) * daysDifference;

        const newTent = new Tents({
            ...req.body,
            status: status._id,
            totalAmount: paymentAmount
        });

        console.log("tentCreada", newTent);

        // Guardar la nueva carpa
        const savedTent = await newTent.save();
        res.status(200).json(savedTent);
    } catch (err) {
      console.error("Error en :", error);
      next(error);
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
        const tent = await Tents.findByIdAndUpdate(req.params.id).populate('status')  //busca la carpa con el id que le pasamos 

         res.status(200).json(tent)
     }catch(err) {
        next(err);
     }
}

export const getTents = async(req, res, next) =>{
    try{
        const tents = await Tents.find().populate('status');

        res.status(200).json(tents)
     }catch(err) {
         next(err)
     }

}

export const getOccupiedPositions = async (req, res, next) => {
  try {
      const tents = await Tents.find().populate('status');
      const occupiedPositions = tents
          .filter(tent => tent.location) // Filtrar si la ubicación existe
          .map(tent => tent.location);

      res.status(200).json({ occupiedPositions });
  } catch (err) {
      console.log(err);
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

