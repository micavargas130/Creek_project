import Lodge_X_Status from '../models/Lodge_X_Status.js';

export const newEntry = async (req, res, next) => {
    console.log("fk")
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
        const lodge_x_status = await Lodge_X_Status.find().populate('status');
        res.status(200).json(lodge_x_status);
    } catch (err) {
        next(err);
    }
  };

  export const getEntries = async (req, res, next) => {
    try {
      const { lodgeId } = req.params; // Obtén el lodgeId de los parámetros de la URL
      const query = lodgeId ? { lodge: lodgeId } : {}; // Filtra por lodgeId si existe
      
      // Buscar los registros de acuerdo al lodgeId
      const lodgeEntries = await Lodge_X_Status.find(query).populate('status');
      res.status(200).json(lodgeEntries);
    } catch (err) {
      next(err);
    }
  };

  export const getLatestEntry = async (req, res, next) => {
    try {
      const { lodgeId } = req.params;
  
      const latestStatus = await Lodge_X_Status.findOne({ lodge: lodgeId })
        .populate("status")
        .sort({ createdAt: -1 });
  
      if (!latestStatus) {
        return res.status(200).json(null); //devuelve null si no hay historial
      }
  
      res.status(200).json(latestStatus);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el estado más reciente" });
    }
  };
  