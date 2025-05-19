const mongoose = require( 'mongoose');
const { Schema } = mongoose;

const ScheduleSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee', 
    required: true,
  },

  task: {
      type:String,
      required: true,
  },
  startDate: {
      type: String,
      required: true
  },
  endDate:{
    type: String,
    required: true
  },

  startTime: { 
      type: String,
      required: true
  },
  endTime: {
      type: String,
      required: true
  },

});

export default mongoose.model('Schedule', ScheduleSchema);