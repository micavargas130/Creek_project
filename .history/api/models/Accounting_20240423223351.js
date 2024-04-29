import mongoose from 'mongoose';


const accountingSchema = new mongoose.Schema({

    amount:{
        type: String,
        requiered: true
    },

    type:{
     type: String,
     requiered: true
    },

    date: {
        type: Date, 
        requiered: true
    },

    user: {
         type: String, 
         ref: 'User',
          required: false,
         },

    cabain: {
        type: String, 
        ref: 'Cabain', required: false,
        },
    


    comment: {
        type: String,
    },
    
   
});

export default mongoose.model('Accounting', accountingSchema);