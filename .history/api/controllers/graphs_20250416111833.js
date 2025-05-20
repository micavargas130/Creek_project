import Booking from '../models/Bookings.js';
import Tent from '../models/Tents.js';
import mongoose from 'mongoose';

export const getReservationsOverTime = async (req, res) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$checkIn" },
            month: { $month: "$checkIn" },
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const tents = await Tent.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$checkIn" },
            month: { $month: "$checkIn" },
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({ bookings, tents });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener reservas por tiempo" });
  }
};


