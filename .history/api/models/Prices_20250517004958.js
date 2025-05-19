const mongoose = require( 'mongoose');

const priceSchema = new mongoose.Schema({
  priceAdult: {
    type: Number,
    required: true
  },
  priceChild: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ["cabanas", "carpas"], // Solo puede ser 'cabanas' o 'carpas'
    required: true,
  },
  
}, {timestamps: true },
);

export default mongoose.model('Price', priceSchema);