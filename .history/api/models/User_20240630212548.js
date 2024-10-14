import mongoose from 'mongoose'
const { Schema } = mongoose


//datos de los usuarios 
const UserSchema = new mongoose.Schema({
    email: {
        type:String,
        requiered:true,
        unique:true
    },
    
    password:{
        type:String,
        requiered:true,
    },

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

    phone: {
        type: Number,
        
    },

  
    birthday: {
        type: String,
        
    },

    ocupation: {
        type: String,
        
    },

    email: {
        type: String,
        required: false,   
    },

    photo:{
        type: String,
        requiered: true
       },
    
       photo:{
        type: String,
        requiered: true
       },

    isAdmin: {
        type: Boolean,
        default: false
    },

    isEmployee: {
        type: Boolean,
        default: false
    },


},

{timestamps: true}  //para que se actualice cada cierto tiempo

);

export default mongoose.model("User", UserSchema);
