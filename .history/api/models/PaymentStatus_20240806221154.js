import mongoose from 'mongoose';

const paymentStatusSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded'], // Puedes agregar más estados según sea necesario
    },
 

});

export default mongoose.model('PaymentStatus', paymentStatusSchema);
