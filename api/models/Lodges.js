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



    price: {
        type: Number,
        min: 0, 
        max: 50000
    },

    roomNumbers: [{ number: Number, unavailableDates:{type:[Date]} }],



});

export default mongoose.model("Lodges", LodgesSchema);
