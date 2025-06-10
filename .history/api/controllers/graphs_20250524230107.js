import Booking from '../models/Bookings.js';
import Tent from '../models/Tents.js';


  
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
    