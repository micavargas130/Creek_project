const mongoose = require() 'mongoose';

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
    lodge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: false,
    },
    tent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tents',
        required: false,
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentStatus',
    },
    price: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prices'
    },
    totalAmount: {
        type: Number, // Monto total de la reserva
        required: true,
    },
    remainingAmount: {
        type: Number, // Saldo restante por pagar
        required: false,
    },
});

export default mongoose.model('Accounting', accountingSchema);
