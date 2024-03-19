import mongoose from 'mongoose'
const { Schema } = mongoose


//datos de las cabañas 
const LodgesSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
 
    description: {
        type: String,
        required: true
    },


    photos: {
       type: [String],
       required: true
    },

  
    capacity: {
        type: Number,
        required: true
    },

    services: {
       type: String,
       required: true
    },

    unavailableDates:{
        type:[Date]},
    
    state: {
            type: String,
            default: "Desocupada",
        },

    occupiedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'booking'
    },

    comment: {
        type: String
    },

    numberOfGuests:{
        type: String,
        requiered: true
        
    },


});

export default mongoose.model("Lodges", LodgesSchema);
