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
  effectiveDate: {
    type: Date,
    required: true,
    default: Date.now  // Para registrar desde cuándo son efectivos estos precios
  }
});

export default mongoose.model('Price', priceSchema);