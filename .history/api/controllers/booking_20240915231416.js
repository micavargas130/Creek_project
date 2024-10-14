import Booking from '../models/Bookings.js';
import BookingStatus from '../models/BookingsStatus.js';
import Prices from '../models/Prices.js';

export const createBooking = async (req, res, next) => {
  try {
    // Buscar el estado "Activa" en la colección de BookingStatus
    const activeStatus = await BookingStatus.findOne({ status: 'Activa' });
    if (!activeStatus) {
      return res.status(500).json({ error: 'El estado "Activa" no existe en la base de datos' });
    }
    
    // Busca el lodge usando el ID que recibes en req.body.lodge
    const prices = await Prices.findById("66a82bc2ac1709160e479670");
    console.log(prices.priceAdult)
    
    //Para sacar el precio de la estadía según el número de personas
    const { numberOfAdults, numberOfChildren } = req.body;
    const totalAmount = (numberOfAdults * prices.priceAdult) + (numberOfChildren * prices.priceChild);

    const newBooking = new Booking({
      lodge: req.body.lodge,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      user: req.body.user,
      numberOfAdults: req.body.numberOfAdults,
      numberOfChildren:
      totalAmount: totalAmount,
      status: activeStatus._id // Referenciar el estado "Activa"
    });

    await newBooking.save();
    res.status(200).send('Booking registered correctly');
  } catch (err) {
    next(err);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
    .populate('lodge', 'name')
    .populate('user', 'first_name last_name')
    .populate('status', 'status');
      
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'first_name last_name').populate('status').populate('lodge');
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

export const getBookingByUser = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate('status'); // Populate para obtener el estado completo
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

export const deleteBookingByLodge = async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndDelete({ lodge: req.params.lodgeId }).populate('status'); // Populate para obtener el estado completo
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json({ message: 'Booking deleted successfully' });
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
