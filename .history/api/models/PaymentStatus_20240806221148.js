import mongoose from 'mongoose';

const paymentStatusSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded'], // Puedes agregar más estados según sea necesario
    },
 
    accounting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accounting',
        required: true,
    },
});

export default mongoose.model('PaymentStatus', paymentStatusSchema);
