const mongoose = require( 'mongoose');

const tentsSchema = new mongoose.Schema({
    first_name: { 
        type: String
    },
    last_name: {
        type: String
    },
    dni: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: false
    },
    phone: {
        type: Number
    },
    occupation: {
        type: String
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date
    },
    numberOfAdults: {
        type: Number,
        required: true
    },
    numberOfChildren: {
        type: Number,
        required: true
    },
    location: {
        row: { type: Number },
        col: { type: Number }
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookingStatus'
    },
    totalAmount: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Tents', tentsSchema);
