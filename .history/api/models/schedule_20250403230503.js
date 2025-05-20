  import mongoose from 'mongoose';
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
    date: {
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
    status: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Status',
    }

  });
  
  export default mongoose.model('Schedule', ScheduleSchema);