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
    
    email:{
        type: String,
        requiered: true
        
    },

    base_salary:{
        type: Number,
        requiered: true
    },

    start_date:{
        type: Date,
        requiered: true
    },

    Status:{
        type: String,
        default: String,
        requiered: true
    },

   
});

export default mongoose.model('Booking', bookingSchema);