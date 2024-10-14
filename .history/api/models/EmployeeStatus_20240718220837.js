import mongoose from 'mongoose';

const employeeStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.model('EmployeeStatus', employeeStatusSchema);