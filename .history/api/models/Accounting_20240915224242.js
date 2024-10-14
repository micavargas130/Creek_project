import mongoose from 'mongoose';

const accountingSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: String,
        ref: 'User',
        required: false,
    },
    lodge: {
        type: String,
        ref: 'Cabain',
        required: false,
    },
    comment: {
        type: String,
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentStatus',
    },
});

export default mongoose.model('Accounting', accountingSchema);
