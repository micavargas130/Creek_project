

  import mongoose from 'mongoose';
  const { Schema } = mongoose;
  
  const ScheduleSchema = new Schema({
    employee: {
      type: String,
      required: true
    },

    task{
        type:String,
        required: true
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
        type:String,
        required: true,
    }

  });
  
  export default mongoose.model('Status', StatusSchema);