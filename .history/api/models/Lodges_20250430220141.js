import mongoose from 'mongoose';
const { Schema } = mongoose;

// datos de las cabañas 
const LodgesSchema = new Schema({
  name: { 
    type: String, 
    required: true
  },
 
  description: {
    type: String,
    required: true
  },

  photos: {
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

});

export default mongoose.model("Lodges", LodgesSchema);