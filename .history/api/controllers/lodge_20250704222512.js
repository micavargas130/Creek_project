import multer from "multer";
import path from "path";
import Lodges from '../models/Lodges.js';
import Accounting from '../models/Accounting.js';
import Status from '../models/Status.js';
import Booking from '../models/Bookings.js';
import BookingStatus from '../models/BookingsStatus.js';
import LodgeXStatus from "../models/Lodge_X_Status.js";

export const createLodge = async (req, res, next) => {
  try {

    const status = await Status.findOne({ status: "desocupada" });
    const newLodge = new Lodges({
      ...req.body,
      state: status._id,
      photos: req.file ? req.file.path : req.body.photos // Usa el path del archivo o el link
    });

    const savedLodge = await newLodge.save();
    res.status(200).json(savedLodge);
  } catch (err) {
    console.error("❌ Error al crear lodge:", err); 
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
    // Obtener todas las cabañas
    const lodges = await Lodges.find();
    
    if (!lodges.length) {
      return res.status(404).json({ message: "No hay cabañas registradas." });
    }

    // Obtener el último estado de cada cabaña
    const lodgesWithDetails = await Promise.all(
      lodges.map(async (lodge) => {

        const latestStatus = await LodgeXStatus.findOne({ lodge: lodge._id })
          .sort({ createdAt: -1 }) // Buscar el más reciente
          .populate("status") // Poblar estado
          .populate({
            path: "booking",
            populate: { path: "user", select: "name email phone", options: { strictPopulate: false } }
          });


        //Verificar si latestStatus existe antes de acceder a sus propiedades
        const estado = latestStatus?.status?.status || "desocupada";
        const comentario = latestStatus?.comment || "";
        const usuario = latestStatus?.booking?.user || null;

        let paymentInfo = null;
        if (latestStatus?.booking) {
          const accounting = await Accounting.findOne({ lodge: latestStatus.booking._id })
            .populate("status", "status")
            .select("status");

          if (accounting) {
            paymentInfo = {
              _id: accounting._id || null,
              paymentStatus: accounting.status?.status || "No registrado",
            };
          }
        }

        return {
          ...lodge.toObject(),
          latestStatus: estado,
          comment: comentario,
          user: usuario,
          paymentInfo: paymentInfo,
        };
      })
    );

    res.status(200).json(lodgesWithDetails);
  } catch (err) {
    console.error("❌ Error al obtener las cabañas:", err);
    res.status(500).json({ message: "Error interno del servidor", error: err });
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

//función auxiliar para generar un array de fechas en un rango
const getDatesInRange = (start, end) => {
  const date = new Date(start);
  let list = [];
  while (date <= new Date(end)) {
    list.push(new Date(date).toISOString().split("T")[0]); // Formato YYYY-MM-DD
    date.setDate(date.getDate() + 1);
  }
  return list;
};

export const getLodgesByAvailableDate = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    // Validación mínima
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: "Faltan fechas checkIn o checkOut" });
    }

    const lodges = await Lodges.find();

    const overlappingBookings = await Booking.find({
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } },
      ],
      
    });

    const occupiedLodgeIds = overlappingBookings.map(b => b.lodge.toString());

    const availableLodges = lodges.filter(l => !occupiedLodgeIds.includes(l._id.toString()));

    res.json(availableLodges);
  } catch (error) {
    console.error("Error en getLodgesByAvailableDate:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const getLodgeAvailability = async (req, res) => {
  try {
    const lodgeId = req.params.id;

    // Obtener el estado "Cancelada" para excluirlo de la consulta
    const canceledStatus = await BookingStatus.findOne({ status: "Cancelada" });

    // Buscar solo reservas activas (que no estén canceladas)
    const activeBookings = await Booking.find({
      lodge: lodgeId,
      status: { $ne: canceledStatus._id }, // Excluye las reservas canceladas
    }).select("checkIn checkOut");

    console.log("aca")

    // Extraer todas las fechas ocupadas
    let occupiedDates = [];
    activeBookings.forEach((booking) => {
      let dates = getDatesInRange(booking.checkIn, booking.checkOut);
      occupiedDates = occupiedDates.concat(dates);
    });

        console.log("ocupadas", occupiedDates)

    res.json({ occupiedDates });
  } catch (error) {
    console.error("Error obteniendo fechas ocupadas:", error);
    res.status(500).json({ message: "Error obteniendo fechas ocupadas", error });
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