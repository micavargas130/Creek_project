import Tents from "../models/Tents.js"
import Status from '../models/BookingsStatus.js';
import Price from '../models/Prices.js';



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

