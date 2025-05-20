import Schema from "mongoose";

// datos de los usuarios 
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        required:false,
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
        required: false, 
    },

    photo: {
        type: String,
        required: false,
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    isEmployee: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

export default mongoose.model("User", UserSchema);

