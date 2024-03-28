import mongoose from 'mongoose';


const employeeSchema = new mongoose.Schema({


    first_name:{
        type: String,
        requiered: true
    },

    checkIn:{
     type: Date,
     requiered: true
    },

    checkOut: {
        type: Date, 
        requiered: true
    },

    totalAmount:{
        type: Number,
        requiered: true
    },

    user: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User', required: true
         },

    name: {
        type: String,
        required: true
    },
    
    numberOfGuests:{
        type: String,
        requiered: true
        
    },

    status:{
        type: String,
        default: "Available",
        requiered: true
    },

   
});

export default mongoose.model('Booking', bookingSchema);