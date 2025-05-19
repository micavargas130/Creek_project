import Booking from '../models/Bookings.js';
import Tent from '../models/Tents.js';

export const getReservationsOverTime = async (req, res) => {
  const { vista, fecha } = req.query;

  const match = {}; // Filtro común para reservas
  if ((vista === "dia" || vista === "fecha") && fecha) {
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999); // Asegura que el filtro cubra todo el día

    match.checkIn = { $gte: fechaInicio, $lte: fechaFin };
  }

  // Para agrupar por año, mes y día
  const groupBy = {};
  if (vista === "año") {
    groupBy.year = { $year: "$checkIn" };
  } else if (vista === "mes") {
    groupBy.year = { $year: "$checkIn" };
    groupBy.month = { $month: "$checkIn" };
  } else if (vista === "dia" || vista === "fecha") {
    groupBy.year = { $year: "$checkIn" };
    groupBy.month = { $month: "$checkIn" };
    groupBy.day = { $dayOfMonth: "$checkIn" };
  }

  try {
    const bookings = await Booking.aggregate([
      { $match: match },
      { $group: { _id: groupBy, total: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      { $limit: 6 }   // 👉 MOSTRAR SOLO 6 FECHAS
    ]);

    const tents = await Tent.aggregate([
      { $match: match },
      { $group: { _id: groupBy, total: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      { $limit: 6 }   // 👉 MOSTRAR SOLO 6 FECHAS
    ]);

    res.status(200).json({ bookings, tents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener reservas por tiempo" });
  }
};

  
  export const getReservationsByLodge = async (req, res) => {
    try {
      const result = await Booking.aggregate([
        {
          $group: {
            _id: "$lodge",
            total: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: "lodges",           // Nombre de tu colección de cabañas
            localField: "_id",         // El _id del grupo (que es el lodge)
            foreignField: "_id",       // El _id del lodge
            as: "lodgeDetails"         // Así se va a llamar el array con la info
          }
        },
        {
          $unwind: "$lodgeDetails"     // Para aplanarlo y trabajar más fácil
        },
        {
          $project: {
            _id: 0,
            lodgeId: "$lodgeDetails._id",
            lodgeName: "$lodgeDetails.name",
            total: 1
          }
        }
      ]);
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener reservas por cabaña" });
    }
  };  
  
  export const getAverageGuests = async (req, res) => {
    try {
      const bookings = await Booking.aggregate([
        {
          $project: {
            totalGuests: { $add: ["$numberOfAdults", "$numberOfChildren"] }
          }
        },
        {
          $group: {
            _id: null,
            avgGuests: { $avg: "$totalGuests" }
          }
        }
      ]);
  
      const tents = await Tent.aggregate([
        {
          $project: {
            totalGuests: { $add: ["$numberOfAdults", "$numberOfChildren"] }
          }
        },
        {
          $group: {
            _id: null,
            avgGuests: { $avg: "$totalGuests" }
          }
        }
      ]);
  
      res.status(200).json({
        avgGuestsLodges: bookings[0]?.avgGuests || 0,
        avgGuestsTents: tents[0]?.avgGuests || 0
      });
    } catch (err) {
      res.status(500).json({ error: "Error al calcular promedio de huéspedes" });
    }
  };
  
  export const getAverageStayDuration = async (req, res) => {
    try {
      const bookings = await Booking.aggregate([
        {
          $project: {
            stayLength: {
              $divide: [
                { $subtract: ["$checkOut", "$checkIn"] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgStay: { $avg: "$stayLength" }
          }
        }
      ]);
  
      const tents = await Tent.aggregate([
        {
          $project: {
            stayLength: {
              $divide: [
                { $subtract: ["$checkOut", "$checkIn"] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgStay: { $avg: "$stayLength" }
          }
        }
      ]);
  
      res.status(200).json({
        avgStayLodges: bookings[0]?.avgStay || 0,
        avgStayTents: tents[0]?.avgStay || 0
      });
    } catch (err) {
      res.status(500).json({ error: "Error al calcular duración promedio de estadías" });
    }
  };
    