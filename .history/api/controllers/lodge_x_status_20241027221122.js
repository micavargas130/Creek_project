import Lodge_X_Status from '../models/Lodge_X_Status.js';

export const newEntry = async (req, res, next) => {
    const newEntry= new Lodge_X_Status(req.body)  
    try{

        const savedEntry = await newEntry.save()
        res.status(200).json(savedEntry)


    }catch(err){
        next(err);
    }
}


export const getEntry = async (req, res, next) => {
    try {
        const lodge_x_status = await Lodge_X_Status.findById(req.params.id).populate('status');
        res.status(200).json(lodge_x_status);
    } catch (err) {
        next(err);
    }
  };

  export const getEntries = async (req, res, next) => {
    try {
      const { lodge } = req.query; // Obtener el ID de la cabaña del parámetro de consulta
      console.log(lodge)
      // Si lodge existe en los parámetros de consulta, filtrar por lodge ID
      const query = lodge ? { lodge } : {}; 
  
      // Buscar los registros, con `populate` si es necesario
      const lodgeEntries = await Lodge_X_Status.find(query).populate('status');
      res.status(200).json(lodgeEntries);
    } catch (err) {
      next(err);
    }
  };