import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  priceAdult: {
    type: Number,
    required: true
  },
  priceChild: {
    type: Number,
    required: true
  },
});

export default mongoose.model('Price', priceSchema);