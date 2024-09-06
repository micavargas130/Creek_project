import mongoose from 'mongoose';

const paymentTypeSchema = new mongoose.Schema({
    Type: {
        type: String,
        required: true,
       
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
