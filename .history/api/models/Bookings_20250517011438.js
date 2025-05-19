import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  lodge: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Lodges'
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
  numberOfAdults: {
    type: Number,
    required: true
  },

  numberOfChildren: {
    type: Number,
    required: true
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookingStatus',
    required: true
  },
  createdAt: { type: Date, default: Date.now }

});

export default mongoose.model('Booking', bookingSchema);
