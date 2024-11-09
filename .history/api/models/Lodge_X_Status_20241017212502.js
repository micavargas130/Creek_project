import mongoose from 'mongoose';
const { Schema } = mongoose;

// datos de las cabañas 
const Lodge_X_StatusSchema = new Schema({
  
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
  },
  
  : {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking'
  },

  comment: {
    type: String
  },

});

export default mongoose.model("Lodge_X_Status", Lodge_X_StatusSchema);