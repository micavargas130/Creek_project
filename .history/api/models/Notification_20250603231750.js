import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({

    type:{
        type: String,
        requiered: true
       },
    
    cabain:
     {type: mongoose.Schema.Types.ObjectId, 
        ref: "Lodges"
      },

    client: {
     type: mongoose.Schema.Types.ObjectId, 
        requiered: true
        ref: "Lodges"
    },

    date: {
        type: Date, 
    },

    closedBy: [{
        type: mongoose.Schema.Types.ObjectId 
    }],
},

{timestamps: true }

);

export default mongoose.model('Notification', notificationSchema);