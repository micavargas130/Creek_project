import Booking from '../models/Bookings.js';
import BookingStatus from '../models/BookingsStatus.js';
import { sendBookingEmail, sendCancellationEmail } from "../utils/emailService.js";
import User from "../models/User.js"; 
import Lodges from '../models/Lodges.js';
import Price from '../models/Prices.js';

export const createBooking = async (req, res, next) => {
  try {
    const { lodge, checkIn, checkOut, user, numberOfAdults, numberOfChildren, sendEmail, password } = req.body; // Recibir la contraseña desde el frontend

    const pendingStatus = await BookingStatus.findOne({ status: "Pendiente" });
    if (!activeStatus) {
      return res.status(500).json({ error: 'El estado "Activa" no existe' });
    }

    // Obtener el último precio registrado para cabañas
    const prices = await Price.find({ category: "cabanas" }).sort({ createdAt: -1 }).limit(1);
    if (prices.length === 0) {
      return res.status(400).json({ error: "No hay precios registrados para cabañas" });
    }
    
    const latestPrice = prices[0];

    // Calcular cantidad de noches
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    // Calcular el monto total usando los precios obtenidos
    const totalPrice = ((numberOfAdults * latestPrice.priceAdult) + (numberOfChildren * latestPrice.priceChild)) * nights;

    // Crear la reserva con el total calculado
    const newBooking = new Booking({
      lodge,
      checkIn,
      checkOut,
      user,
      numberOfAdults,
      numberOfChildren,
      totalAmount: totalPrice,
      status: activeStatus._id,
    });

    await newBooking.save();

    // Enviar el email SOLO si sendEmail es true
    if (sendEmail) {
      const userInfo = await User.findById(user);
      if (!userInfo) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      await sendBookingEmail(userInfo.email, userInfo.first_name, password, { 
        checkIn,
        checkOut,
        lodgeName: newBooking.lodge.name,
        totalPrice,
      });

      console.log("Correo enviado a:", userInfo.email);
    } else {
      console.log("Reserva creada SIN envío de correo.");
    }

    res.status(200).json(newBooking);
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

    res.json(bookings);
  } catch (err) {
     console.error("Error en GET /bookings:", err);  // 🔹 Imprime el error exacto
    res.status(500).json({ error: "Error interno del servidor" });
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

    // Buscar la reserva
    const booking = await Booking.findById(bookingId).populate("user").populate("lodge");
    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Buscar el estado "Cancelada"
    const canceledStatus = await BookingStatus.findOne({ status: "Cancelada" });
    if (!canceledStatus) {
      return res.status(500).json({ error: 'El estado "Cancelada" no existe en la base de datos' });
    }

    // Actualizar el estado de la reserva a "Cancelada"
    booking.status = canceledStatus._id;
    await booking.save();

    // Enviar el email de cancelación
    if (booking.user) {
      await sendCancellationEmail(booking.user.email, booking.user.first_name, {
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        lodgeName: booking.lodge.name,
        totalPrice: booking.totalAmount,
      });
    }

    res.json({ message: "Reserva cancelada y correo de cancelación enviado correctamente" });
  } catch (error) {
    console.error("Error al marcar la reserva como cancelada", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
