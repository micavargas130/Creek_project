import mongoose from 'mongoose';


const employeeSchema = new mongoose.Schema({


    first_name:{
        type: String,
        requiered: true
    },

    last_name:{
     type: String,
     requiered: true
    },

    birthday: {
        type: Date, 
        requiered: true
    },

    password:{
        type: String,
        requiered: true
    },

    phone_number: {
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