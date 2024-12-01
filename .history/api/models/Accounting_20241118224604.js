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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    lodge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lodges',
        required: false,
    },
    tent: {
        type: String,
        ref: 'tent',
        required: false,
    },
    comment: {
        type: String,
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentStatus',
    },
    totalAmount: {
        type: Number, // Monto total de la reserva
        required: true,
    },
    remainingAmount: {
        type: Number, // Saldo restante por pagar
        required: true,
    },
});
export default mongoose.model('Accounting', accountingSchema);
