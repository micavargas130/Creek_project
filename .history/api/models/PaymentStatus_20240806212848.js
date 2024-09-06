import mongoose from 'mongoose';

const paymentTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded'], // Puedes agregar más estados según sea necesario
    },
    date: {
        type: Date,
        default: Date.now,
    },
    accounting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accounting',
        required: true,
    },
});

export default mongoose.model('PaymentStatus', paymentStatusSchema);
