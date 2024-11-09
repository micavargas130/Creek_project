import Lodge_X_Status from '../models/Lodge_X_Status.js';

export const newEntry = async (req, res, next) => {
    const newEntry= new Lodge_X_Status(req.body)  //body guarda la info de la cabaña 
    try{

        const savedNotification = await newNotification.save()
        res.status(200).json(savedNotification)


    }catch(err){
        next(err);
    }
}
export const updatePrices = async (req, res, next) => {
  try {
    const { priceAdult, priceChild } = req.body;
    const priceId = req.params.id; 

    // "findByIdAndUpdate" para actualizar el documento existente
    const updatedPrice = await Price.findByIdAndUpdate(
      priceId, // ID del precio a actualizar
      { priceAdult, priceChild }, // Datos actualizados
      { new: true } 
    );

    if (!updatedPrice) {
      return res.status(404).json({ message: "Precio no encontrado" });
    }

    res.status(200).json(updatedPrice); 
  } catch (err) {
    next(err);
  }
};


export const getPrice = async (req, res, next) => {
  try {
      const price = await Price.findById(req.params.id);
      res.status(200).json(price);
  } catch (err) {
      next(err);
  }
};