import mongoose from 'mongoose';


const notificationSchema = new mongoose.Schema({

    :
     {type: mongoose.Schema.Types.ObjectId, 
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