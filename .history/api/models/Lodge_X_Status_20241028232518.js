import mongoose from 'mongoose';
const { Schema } = mongoose;

//Tabla pasarela de Cabaña x estado
const Lodge_X_StatusSchema = new Schema({
  
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
  },
  
  lodge: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lodge'
  },

  booking: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking'
  },

  comment: {
    type: String
  },

}, { timestamps: true });

export default mongoose.model("Lodge_X_Status", Lodge_X_StatusSchema);