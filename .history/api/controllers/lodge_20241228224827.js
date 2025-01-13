import multer from "multer";
import path from "path";
import Lodges from '../models/Lodges.js';
import Accounting from '../models/Accounting.js';
import Status from '../models/Status.js';
import Booking from '../models/Bookings.js';

export const createLodge = async (req, res, next) => {
  try {
    const status = await Status.findOne({ status: "desocupada" });
    const newLodge = new Lodges({
      ...req.body,
      state: status._id,
      comment: null,
      occupiedBy: null,
      photos: req.file ? req.file.path : req.body.photos // Usa el path del archivo o el link
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
        // Obtener el estado "ocupado"
        const status = await Status.findOne({ status: "ocupado" });
    
        // Obtener el ID de la cabaña desde los parámetros de la solicitud
        const lodgeId = req.params.id;
    
        // Actualizar tanto el estado de la cabaña como el campo "occupiedBy" en una sola operación
        const updatedLodge = await Lodges.findByIdAndUpdate(
          lodgeId,
          {
            state: status._id,
            occupiedBy: req.body._id  // ID del usuario o la reserva que se pasa en el cuerpo de la solicitud
          },
          { new: true }
        );
    
        // Enviar la cabaña actualizada como respuesta
        res.json(updatedLodge);
      } catch (error) {
        console.error('Error al marcar la cabaña como ocupada y actualizar occupiedBy:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    };


export const setDesocupada = async (req, res, next) => {
    try {
        const status = await Status.findOne({ status: "desocupada" });
        const lodgeId = req.params.id;
    
        // Actualizar el estado de la cabaña a "desocupada" y eliminar el campo occupiedBy
        const updatedLodge = await Lodges.findByIdAndUpdate(
          lodgeId,
          { 
            state: status._id, 
            $unset: { occupiedBy: 1 } // Elimina el campo occupiedBy
          }, 
          { new: true }
        );
    
        res.json(updatedLodge);
      } catch (error) {
        console.error('Error al marcar la cabaña como desocupada y eliminar occupiedBy:', error);
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


export const getLodges = async (req, res) => {
  try {
    // Primero obtenemos todas las cabañas con la información básica de las reservas.
    const lodges = await Lodges.find()
      .populate('occupiedBy') // Obtiene los datos de la reserva (Booking)
      .populate('state'); // Obtiene los datos del estado de la cabaña

    // Agregamos información de pagos a cada cabaña, buscando en Accounting y luego el estado del pago.
    const lodgesWithPaymentInfo = await Promise.all(
      lodges.map(async (lodge) => {
        if (lodge.occupiedBy) {
          // Buscar en Accounting usando el ID de la reserva
          const accounting = await Accounting.findOne({
            lodge: lodge.occupiedBy._id,
          })
            .populate('status', 'status') // Usar populate para traer el nombre del estado desde Status
            .select('status');

          console.log(accounting.status.status);

          return {
            ...lodge.toObject(),
            paymentInfo: accounting
              ? {
                  paymentStatus: accounting.status?.status || null, // Extraer el nombre del estado
                }
              : null, // Si no existe información de pagos
          };
        }

        return {
          ...lodge.toObject(),
          paymentInfo: null, // Sin información de pagos
        };
      })
    );

    res.status(200).json(lodgesWithPaymentInfo);
  } catch (err) {
    res.status(500).json(err);
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

export const getOccupiedDates = async (req,res) => {
  try {
    // Asegúrate de obtener solo los campos relevantes para evitar referencias circulares
    const bookings = await Booking.find({
      'lodge._id': req.params, // Asegura que solo estás buscando por el _id del lodge
    }).select('checkIn checkOut'); // Selecciona solo los campos necesarios para tu lógica

    console.log(req.params)

    if (!bookings || bookings.length === 0) {
      console.log('No se encontraron reservas para este lodge.');
      return [];
    }

    const occupiedDates = [];
    bookings.forEach((booking) => {
      let currentDate = new Date(booking.checkIn);
      while (currentDate <= new Date(booking.checkOut)) {
        occupiedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return occupiedDates;
  } catch (error) {
    console.error('Error en getOccupiedDates:', error);
    throw error;
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

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads"); // Carpeta donde se guardan las imágenes
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Filtro de tipo de archivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo se permiten imágenes."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadPhotos = async (req, res, next) => {
  upload.array("photos", 10)(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message }); // Errores específicos de Multer
      }
      return res.status(500).json({ error: err.message }); // Otros errores
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No se subió ninguna imagen." });
      }

      const lodgeId = req.params.id; // ID de la cabaña
      const filePaths = req.files.map((file) => `uploads/${file.filename}`); // Rutas de las imágenes

      // Actualizar el modelo con las nuevas imágenes
      const updatedLodge = await Lodges.findByIdAndUpdate(
        lodgeId,
        { $push: { photos: { $each: filePaths } } },
        { new: true }
      );

      res.status(200).json({
        message: "Imágenes cargadas exitosamente.",
        updatedLodge,
      });
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
};