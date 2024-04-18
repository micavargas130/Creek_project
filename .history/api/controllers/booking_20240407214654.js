import User from '../controllers/user.js';
import Booking from '../models/Bookings.js';

export const createBooking = async (req, res, next) =>{ 
 try{
        const newBooking = new Booking({
        place: req.body.place,
        placeName: req.body.placeName,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        user: req.body.user,
        name: req.body.name,
        numberOfGuests: req.body.numberOfGuests,
        totalAmount: req.body.totalAmount,

    })
    await newBooking.save();
    res.status(200).send('Booking registered correctly');

    }catch(err){
        next(err);
    }

}

export const getBookings = async(req, res, next) =>{
    try{
        const bookings = await Booking.find() 
         res.status(200).json(bookings)
     }catch(err) {
         next(err)
     }

}

export const getBooking = async(req, res, next) =>{
    try{
        const bookings = await Booking.findById(req.params.id) //busca el lodge con el id que le pasamos 
         res.status(200).json(bookings)
     }catch(err) {
        next(err);
     }
}

export const getBookingByUser = async (req, res, next) => {
    try { 
        const bookings = await Booking.find({user : req.params.userId}); // Busca reservas del usuario
        console.log(req.params.user)
        res.status(200).json(bookings); // Devuelve las reservas del usuario
    } catch (err) {
        next(err);
    }
}

export const deleteBookingByLodge = async (req, res, next) => {
    try { 
       
        const bookings = await Booking.findOneAndDelete({place: req.params.lodgeId}); // Busca reservas del usuario
        console.log(req.params.lodgeId)
        res.status(200).json(bookings); // Devuelve las reservas del usuario
    } catch (err) {
        next(err);
    }
}

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

  export const setStatusCompleted = async(req, res, next) =>{
    try {
      const bookingId = req.params.id;
  
      // Realiza la actualización en la base de datos
      const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { state: 'Desocupada' }, { new: true });
  
      // Devuelve la cabaña actualizada como respuesta
      res.json(updatedLodge);
    } catch (error) {
      console.error('Error al marcar la cabaña como ocupada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }