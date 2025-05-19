{
    employee: ObjectId, // Referencia al empleado
    task: String,       // Ej: "Limpieza de baños", "Mantenimiento de cabaña"
    date: Date,         // Día de la tarea
    startTime: String,  // Hora de inicio, ej: "08:00"
    endTime: String,    // Hora de fin, ej: "12:00"
    status: String,     // Opcional: "pendiente", "completado", "en curso"
  }

  import mongoose from 'mongoose';
  const { Schema } = mongoose;
  
  const ScheduleSchema = new Schema({
    employee: {
      type: String,
      required: true,
    },
    
  });
  
  export default mongoose.model('Status', StatusSchema);