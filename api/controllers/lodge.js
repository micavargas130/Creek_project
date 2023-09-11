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

export const countByType = async (req, res, next) =>{
    try{
        const dobleSCount = await Lodges.countDocuments({name:"Habitacion Doble Individual"});
        const dobleMCount = await Lodges.countDocuments({name:"Habitacion Doble Matrimonial"});
        const tripleSCount = await Lodges.countDocuments({name:"Habitacion Triple Individual"})
        const tripleMCount = await Lodges.countDocuments({name:"Habitacion Triple Matrimonial"})
        const cuadrupleSCount = await Lodges.countDocuments({name:"Habitacion Cuadruple Individual"})
        const cuadrupleMCount = await Lodges.countDocuments({name:"Habitacion Cuadruple Matrimonial"})

        res.status(200).json([
           { name:"Habitacion Doble Individual", count:  dobleSCount },
           { name:"Habitacion Doble Matrimonial",  count: dobleMCount },
           { name:"Habitacion Triple Individual",  count: tripleSCount },
           { name:"Habitacion Triple Matrimonial",  count:  tripleMCount },
           { name:"Habitacion Cuadruple Individual", count: cuadrupleSCount},
           { name:"Habitacion Cuadruple Matrimonial", count:  cuadrupleMCount },
        ]);
    }catch(err){
        next(err);
    }
};




// Funcion que retorna el arreglo de numeros de una habitacion en particular
export const getHabitacionRooms = async (req, res, next) =>{
    console.log('getHabitacionRooms called');
    try{
        const lodge = await Lodges.findById(req.params.id);
        //const numeroHabitacionList = habitacion.numeroHabitacion.map(numero => numero.number);
        //res.status(200).json(numeroHabitacionList);
        // res.status(200).json(habitacion.numeroHabitacion);
    }catch(err){
        next(err);
    }
};



export const updateHabitacionAviability = async (req, res, next) =>{
    try{
        await Habitacion.updateOne({"numeroHabitacion._id": req.params.id}, {
            $push: {"numeroHabitacion.$.unavaiableDates": req.body.dates},
          });
        res.status(200).json("El estado de la habitacion fue actualizado");
    }catch(err){
        next(err);
    }
};



export const deleteHabitacionAviability = async (req, res, next) => {
    try {
      await Habitacion.updateMany(
        { "numeroHabitacion._id": req.params.id },
        {
          $pull: { "numeroHabitacion.$.unavaiableDates": { $in: req.body.dates } },
        }
      );
  
      res.status(200).json("Las fechas fueron eliminadas de la habitación");
    } catch (err) {
      next(err);
    }
  };