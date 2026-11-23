import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({

    type:{
        type: String,
        requiered: true
       },
    
    cabain:
     {type: mongoose.Schema.Types.ObjectId, 
        ref: "Lodges",
      },

    client: {
     type: mongoose.Schema.Types.ObjectId, 
        requiered: true,
        ref: "User",
    },

    date: {
        type: Date, 
    },

    closedBy: [{
        type: mongoose.Schema.Types.ObjectId
    }],

    closed: {
        type: Boolean,
        default: false,
    },

    clientName: {
        type: String,
    },

    //reserva que origino el aviso (se usa para no duplicar avisos de seña pendiente)
    relatedBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
    },
},

{timestamps: true }

);

export default mongoose.model('Notification', notificationSchema);