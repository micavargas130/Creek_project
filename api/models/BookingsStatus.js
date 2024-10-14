import mongoose from 'mongoose';

const bookingStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.model('BookingStatus', bookingStatusSchema);