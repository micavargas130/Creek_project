import mongoose from 'mongoose';

const paymentHistorySchema = new mongoose.Schema({
  accounting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accounting',
    required: true, // Relación con la contabilidad específica
  },
  amount: {
    type: Number,
    required: true, // Monto del pago realizado
  },
  date: {
    type: Date,
    default: Date.now, // Fecha en la que se realizó el pago
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentStatus', // Relación con el estado del pago
    required: true,
  },
  receipt:
});

export default mongoose.model('PaymentHistory', paymentHistorySchema);
