import Lodges from '../models/Lodges.js';
import Status from '../models/Status.js';

export const createLodge = async (req, res, next) => {
    try {
        const status = await Status.findOne({ status: "desocupada" });
        const newLodge = new Lodges({
            ...req.body,
            state: status._id
            comment:n
        });

        const savedLodge = await newLodge.save();
        res.status(200).json(savedLodge);
    } catch (err) {
        next(err);
    }
};


export const updateLodge = async (req, res, next) => {
  try {
      const updatedLodge = await Lodges.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(updatedLodge);
  } catch (err) {
      next(err);
  }
};


export const setOcupado = async (req, res, next) => {
  try {
      const status = await Status.findOne({ status: "ocupada" });
      const lodgeId = req.params.id;
      const updatedLodge = await Lodges.findByIdAndUpdate(lodgeId, { state: status._id }, { new: true });
      res.json(updatedLodge);
  } catch (error) {
      console.error('Error al marcar la cabaña como ocupada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};


export const setDesocupada = async (req, res, next) => {
  try {
      const status = await Status.findOne({ status: "desocupada" });
      const lodgeId = req.params.id;
      const updatedLodge = await Lodges.findByIdAndUpdate(lodgeId, { state: status._id }, { new: true });
      res.json(updatedLodge);
  } catch (error) {
      console.error('Error al marcar la cabaña como desocupada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const setMantenimiento = async (req, res, next) => {
  try {
      const status = await Status.findOne({ status: "mantenimiento" });
      const lodgeId = req.params.id;
      const updatedLodge = await Lodges.findByIdAndUpdate(lodgeId, { state: status._id }, { new: true });
      res.json(updatedLodge);
  } catch (error) {
      console.error('Error al marcar la cabaña como en mantenimiento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteLodge = async (req, res, next) => {
  try {
      await Lodges.findByIdAndDelete(req.params.id);
      res.status(200).json("Cabaña eliminada");
  } catch (err) {
      next(err);
  }
};


export const getLodge = async (req, res, next) => {
  try {
      const lodge = await Lodges.findById(req.params.id).populate('state');
      res.status(200).json(lodge);
  } catch (err) {
      next(err);
  }
};


export const getOccupiedPositions = async (req, res, next) => {
  try {
      const lodges = await Lodges.find().populate('state');
      const occupiedPositions = lodges.map(lodge => lodge.location);
      res.status(200).json({ occupiedPositions });
  } catch (err) {
      next(err);
  }
};


export const getLodges = async (req, res, next) => {
  try {
      const lodges = await Lodges.find().populate('state');
      res.status(200).json(lodges);
  } catch (err) {
      next(err);
  }
};



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
          { $push: { "unavailableDates": req.body.dates } }
      );
      res.status(200).json("Lodges status has been updated.");
  } catch (err) {
      next(err);
  }
};


export const deleteOccupiedBy = async (req, res, next) => {
  try {
      const lodgeId = req.params.id;
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
          { "occupiedBy": req.body._id }
      );
      res.status(200).json("Lodges status has been updated.");
  } catch (err) {
      next(err);
  }
};

  
export const deleteLodgesAvailability = async (req, res, next) => {
  try {
      await Lodges.updateOne(
          { "_id": req.params.id },
          { $pullAll: { "unavailableDates": req.body.dates } }
      );
      res.status(200).json("Las fechas fueron eliminadas de la habitación");
  } catch (err) {
      next(err);
  }
};



export const setMantenimientoWithComment = async (req, res, next) => {
  try {
      const status = await Status.findOne({ status: "mantenimiento" });
      const lodgeId = req.params.id;
      const { comment } = req.body;

      const updatedLodge = await Lodges.findByIdAndUpdate(lodgeId, { state: status._id, comment }, { new: true });
      res.json(updatedLodge);
  } catch (error) {
      console.error('Error al poner la cabaña en mantenimiento con comentario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const eliminarComment = async (req, res, next) => {
  try {
      const lodgeId = req.params.id;

      const updatedLodge = await Lodges.findByIdAndUpdate(lodgeId, { comment: null }, { new: true });
      res.json(updatedLodge);
  } catch (error) {
      console.error('Error al eliminar el comentario de mantenimiento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};


