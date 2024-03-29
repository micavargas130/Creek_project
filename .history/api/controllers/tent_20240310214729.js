import Tents from "../models/Tents.js"

export const createTent = async (req, res, next) => {
    const newTent = new Tents(req.body)  //body guarda la info de la cabaña 
    try{

        const savedTent = await newTent.save()
        res.status(200).json(savedTent)


    }catch(err){
        next(err);
    }
}

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
        const occupiedPositions = tents.map((tent) => tent.location); //trae el lote en el que se encuentra la carpa

        res.status(200).json(tents, occupiedPositions)
     }catch(err) {
         next(err)
     }

}

export const deleteTent = async(req, res, next) =>{
    try{
        await Tents.findByIdAndDelete(req.params.id) //busca el lodge con el id que le pasamos 
        res.status(200).json("Carpa eliminada")
    }catch(err) {
        next(err);
    }
}