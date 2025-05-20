const mongoose = require( 'mongoose');
const { Schema } = mongoose;

const StatusSchema = new Schema({
  status: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Status', StatusSchema);