import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Place'
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date, 
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookingStatus',
    required: true
  }
});

export default mongoose.model('Booking', bookingSchema);
