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
        const lodges = await Lodges.find() //busca el lodge con el id que le pasamos 
         res.status(200).json(lodges)
     }catch(err) {
         next(err)
     }

}