import mongoose from 'mongoose';


const tentsSchema = new mongoose.Schema({

    first_name: { 
        type: String, 
        
    },
 
    last_name: {
        type: String,
    },


    dni: {
        type: String,
        unique: true
  
    },
    
    email: {
        type:String,
        requiered:true,
        unique:true
    },

    phone: {
        type: Number,
        
    },

    ocupation: {
        type: String,
        
    },

    checkIn: {
        type: Date,
        
    },

    checkOut: {
        type: Date,
        
    }, 

    numberOfGuests: {
        type: String,
        
    },
    
    location: {
        row: { type: Number },
        col: { type: Number }
    },

    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
      },
    
    price: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price',
        required: true
      }
   
});

export default mongoose.model('Tents', tentsSchema);