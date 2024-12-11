import mongoose from 'mongoose';
const { Schema } = mongoose;

// datos de las cabañas 
const PaymentHistorySchema = new Schema({
  accounting: { 
    type: String, 
    required: true
  },
 
  amount: {
    type: String,
    required: true
  },

  date: {
    type: [String],
    required: false
  },

  capacity: {
    type: Number,
    required: true
  },

  services: {
    type: String,
    required: true
  },

  unavailableDates: {
    type: [Date]
  },
  
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
  },
  
  location: {
    row: { type: Number },
    col: { type: Number }
  },

  occupiedBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking'
  },

  comment: {
    type: String
  },

});

export default mongoose.model("Lodges", LodgesSchema);