import mongoose from 'mongoose';


const notificationSchema = new mongoose.Schema({

    type:{
        type: String,
        requiered: true
       },
    
    cabain:
     {type: mongoose.Schema.Types.ObjectId, 
        requiered: true
    },

    client: {
        type: Date, 
        requiered: true
    },

    date: {
         type: String, 
         ref: 'User', required: false,
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