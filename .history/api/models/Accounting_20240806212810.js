import mongoose from 'mongoose';

const accountingSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentType',
    }],
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: String,
        ref: 'User',
        required: false,
    },
    cabain: {
        type: String,
        ref: 'Cabain',
        required: false,
    },
    comment: {
        type: String,
    },
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentStatus',
    }],
});

export default mongoose.model('Accounting', accountingSchema);
