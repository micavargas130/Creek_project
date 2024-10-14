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
    required: true
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

  numberOfGuests: {
    type: String,
    required: true
  },
});

export default mongoose.model("Lodges", LodgesSchema);