import Booking from '../models/Bookings.js';
import BookingStatus from '../models/BookingsStatus.js';

export const createBooking = async (req, res, next) => {
  try {
    const lodge = await Lodge.findById(req.body.lodge).populate('price');
    const { numberOfAdults, numberOfChildren } = req.body;

    const totalAmount = (numberOfAdults * lodge.price.priceAdult) + (numberOfChildren * lodge.price.priceChild);

    const newBooking = new Booking({
      lodge: req.body.lodge,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      user: req.body.user,
      numberOfGuests: req.body.numberOfGuests,
      totalAmount,
      status: activeStatus._id
    });

    await newBooking.save();
    res.status(200).send('Booking registered correctly');
  } catch (err) {
    next(err);
  }
};

export const setStatusCompleted = async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    // Buscar el estado "Completada" en la colección de BookingStatus
    const completedStatus = await BookingStatus.findOne({ status: 'Completada' });
    if (!completedStatus) {
      return res.status(500).json({ error: 'El estado "Completada" no existe en la base de datos' });
    }

    // Realiza la actualización en la base de datos
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: completedStatus._id }, // Referenciar el estado "Completada"
      { new: true }
    ).populate('status'); // Populate para obtener el estado completo

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error al marcar la reserva como completada', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const setStatusCanceled = async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    // Buscar el estado "Cancelada" en la colección de BookingStatus
    const canceledStatus = await BookingStatus.findOne({ status: 'Cancelada' });
    if (!canceledStatus) {
      return res.status(500).json({ error: 'El estado "Cancelada" no existe en la base de datos' });
    }

    // Realiza la actualización en la base de datos
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: canceledStatus._id }, // Referenciar el estado "Cancelada"
      { new: true }
    ).populate('status'); // Populate para obtener el estado completo

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error al marcar la reserva como cancelada', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
