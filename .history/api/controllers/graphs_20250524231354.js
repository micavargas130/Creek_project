import Booking from '../models/Bookings.js';
import Tent from '../models/Tents.js';

const getAccountingEvolution = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year);
    const month = req.query.month !== "" ? parseInt(req.query.month) : null;

    const startDate = month !== null ? new Date(year, month, 1) : new Date(year, 0, 1);
    const endDate = month !== null ? new Date(year, month + 1, 0, 23, 59, 59) : new Date(year, 11, 31, 23, 59, 59);

    const entries = await Accounting.find({ date: { $gte: startDate, $lte: endDate } });

    const grouped = month !== null
      ? agruparPorDia(entries)
      : agruparPorMes(entries);

    res.status(200).json(grouped);
  } catch (err) {
    next(err);
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
    