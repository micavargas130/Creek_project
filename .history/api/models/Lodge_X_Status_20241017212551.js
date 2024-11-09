import mongoose from 'mongoose';
const { Schema } = mongoose;

// datos de las cabañas 
const Lodge_X_StatusSchema = new Schema({
  
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
  },
  
  lodge: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lodge'
  },

  comment: {
    type: String
  },

}{ timestamps: true });

export default mongoose.model("Lodge_X_Status", Lodge_X_StatusSchema);