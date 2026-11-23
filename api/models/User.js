import mongoose from 'mongoose'
const { Schema } = mongoose;

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

    //sparse: los usuarios de Google no tienen dni y no deben chocar entre si
    dni: {
        type: String,
        unique: true,
        sparse: true
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

    googleId: {
        type: String,
        required: false,
    },

    isGoogleUser: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

//nunca devolver el hash de la contraseña en las respuestas
UserSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

export default mongoose.model("User", UserSchema);

