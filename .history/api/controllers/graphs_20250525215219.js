import Booking from '../models/Bookings.js';
import Tent from '../models/Tents.js';
import Accounting from '../models/Accounting.js';

export const agruparPorMes = (entries) => {
  const resultado = {};

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const mes = date.getMonth(); // 0 = enero, 1 = febrero, etc.

    if (!resultado[mes]) {
      resultado[mes] = { ingresos: 0, egresos: 0 };
    }

    if (entry.type === "Ingreso") {
      resultado[mes].ingresos += entry.amount;
    } else if (entry.type === "Egreso") {
      resultado[mes].egresos += entry.amount;
    }
  });

  // Convertir en array para usar en el gráfico
  const data = Object.keys(resultado).map((mes) => ({
    name: obtenerNombreMes(parseInt(mes)),
    ingresos: resultado[mes].ingresos,
    egresos: resultado[mes].egresos,
  }));

  return data;
};

export const getReservationsOverTime = async (req, res) => {
 const { vista, fecha } = req.query;

 const match = {}; // Filtro común para reservas
 
 if (vista === "dia" && fecha) {
   const fechaInicio = new Date(fecha);
   const fechaFin = new Date(fecha);
   fechaFin.setHours(23, 59, 59, 999);
   match.checkIn = { $gte: fechaInicio, $lte: fechaFin };
 }
 
 if (vista === "mes" && fecha) {
   const fechaInicio = new Date(fecha); // Ej: 2024-11-01
   const fechaFin = new Date(fechaInicio);
   fechaFin.setMonth(fechaFin.getMonth() + 1);
   fechaFin.setDate(0); // último día del mes
   fechaFin.setHours(23, 59, 59, 999);
   match.checkIn = { $gte: fechaInicio, $lte: fechaFin };
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

const obtenerNombreMes = (mesIndex) => {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return meses[mesIndex];
};
export const agruparPorDia = (entries) => {
  const resultado = {};

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const dia = date.getDate(); // 1, 2, ..., 31

    if (!resultado[dia]) {
      resultado[dia] = { ingresos: 0, egresos: 0 };
    }

    if (entry.type === "Ingreso") {
      resultado[dia].ingresos += entry.amount;
    } else if (entry.type === "Egreso") {
      resultado[dia].egresos += entry.amount;
    }
  });

  // Convertir en array ordenado por día
  const data = Object.keys(resultado)
    .sort((a, b) => a - b)
    .map((dia) => ({
      name: `Día ${dia}`,
      ingresos: resultado[dia].ingresos,
      egresos: resultado[dia].egresos,
    }));

  return data;
};

export const getAccountingEvolution = async (req, res, next) => {
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
    