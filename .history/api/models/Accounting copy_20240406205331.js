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

    da: {
        type: Date, 
        requiered: true
    },

    user: {
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