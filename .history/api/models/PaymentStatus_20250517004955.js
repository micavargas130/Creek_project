const mongoose = require( 'mongoose');

const paymentStatusSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
    },
 

});

export default mongoose.model('PaymentStatus', paymentStatusSchema);
