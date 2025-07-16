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

    if (entry.type === "Ingreso" ) {
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
  const groupBy = {}; // ¡Definido siempre!

  try {
    if (vista === "dia") {
      if (!fecha) return res.status(400).json({ error: "Fecha requerida para vista diaria" });
      const fechaInicio = new Date(fecha);
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);
      match.checkIn = { $gte: fechaInicio, $lte: fechaFin };

      groupBy.year = { $year: "$checkIn" };
      groupBy.month = { $month: "$checkIn" };
      groupBy.day = { $dayOfMonth: "$checkIn" };
    }

    if (vista === "mes") {
      if (fecha) {
        const fechaInicio = new Date(fecha); // Ej: 2024-11-01
        fechaInicio.setHours(0, 0, 0, 0); // Asegura inicio del día
        const fechaFin = new Date(fechaInicio);
        fechaFin.setMonth(fechaFin.getMonth() + 1); // Primer día del mes siguiente
        fechaFin.setHours(0, 0, 0, 0);
        
        match.checkIn = { $gte: fechaInicio, $lt: fechaFin }; // 👈 $lt es CLAVE

      }

      groupBy.year = { $year: "$checkIn" };
      groupBy.month = { $month: "$checkIn" };
    }

    if (vista === "año") {
      groupBy.year = { $year: "$checkIn" };
    }

    const bookings = await Booking.aggregate([
      { $match: match },
      { $group: { _id: groupBy, total: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      { $limit: 6 }
    ]);

    const tents = await Tent.aggregate([
      { $match: match },
      { $group: { _id: groupBy, total: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      { $limit: 6 }
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
  const { año, mes } = req.query;
  console.log("query", req.query);

  const match = {};

  if (año) {
    const year = parseInt(año);
    let fechaInicio, fechaFin;

    if (mes) {
      const month = parseInt(mes) - 1;
      fechaInicio = new Date(year, month, 1);
      fechaFin = new Date(year, month + 1, 1);
    } else {
      fechaInicio = new Date(year, 0, 1);
      fechaFin = new Date(year + 1, 0, 1);
    }

    console.log("Filtrando checkIn entre", fechaInicio.toISOString(), "y", fechaFin.toISOString());

    match["checkIn"] = { $gte: fechaInicio, $lt: fechaFin };
  }

  try {
    const result = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$lodge",
          total: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "lodges",
          localField: "_id",
          foreignField: "_id",
          as: "lodgeDetails"
        }
      },
      { $unwind: "$lodgeDetails" },
      {
        $project: {
          _id: 0,
          lodgeId: "$lodgeDetails._id",
          lodgeName: "$lodgeDetails.name",
          total: 1
        }
      }
    ]);

    console.log("result", result);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error en getReservationsByLodge:", err);
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
    