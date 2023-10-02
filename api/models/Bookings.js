import mongoose from 'mongoose';


const bookingSchema = new mongoose.Schema({

    place:
     {type: mongoose.Schema.Types.ObjectId, 
        requiered: true
    },

    placeName:{
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

    state:{
        type: String,
        requiered: true
    },

    unavailableDates:{
        type: [Date]

    }

   
});

export default mongoose.model('Booking', bookingSchema);