import mongoose from 'mongoose';
const { Schema } = mongoose;

const EmployeeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: String,
    required: true
  },
  base_salary: {
    type: Number,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  photo: {
    type: String,
    required: true
  },

 

});

export default mongoose.model('Employee', EmployeeSchema);
