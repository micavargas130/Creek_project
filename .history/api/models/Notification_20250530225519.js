import mongoose from 'mongoose';


const notificationSchema = new mongoose.Schema({

    type:{
        type: String,
        requiered: true
       },
    
    cabain:
     {type: mongoose.Schema.Types.ObjectId,  },

    client: {
     type: mongoose.Schema.Types.ObjectId, 
        requiered: true
    },

    date: {
        type: Date, 
        requiered: true
    },

    closedBy: [{
        type: mongoose.Schema.Types.ObjectId 
    }],
},

{timestamps: true }

);

export default mongoose.model('Notification', notificationSchema);