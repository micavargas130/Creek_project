import User from "../models/User.js"
import bycrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const register = async (req, res, next) => {
    try{
        //hasheamos las contaseñas 
        const salt = bycrypt.genSaltSync(10);
        const hash = bycrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            email: req.body.email,
            password:hash, 
            first_name: req.body.first_name,
	        last_name: req.body.last_name,
            phone:req.body.phone,
	        dni:req.body.dni,
	        birthday: req.body.birthday,
	        ocupation: req.body.ocupation,
        })

    await newUser.save()  
    res.status(200).json(newUser);
        
    }catch(err){
        next(err);
    }
}


export const login = async (req, res, next) => {
    try {
       
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(createError(404, "User not found"));
        }

        const isPasswordCorrect = await bycrypt.compare(req.body.password, user.password);
        console.log("pass", isPasswordCorrect)
        if (!isPasswordCorrect) {
            return next(createError(400, "Incorrect password or email"));
        }

        // token para verificar la información de cada usuario y saber si es admin o no 
        const token = jwt.sign({ id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name, isEmployee: user.isEmployee, isAdmin: user.isAdmin }, process.env.JWT_KEY);
        // establece la cookie con el nombre "token"
        res.cookie("token", token, { httpOnly: true }).status(200).json(user);
    } catch (err) {
        next(err);
    }
};


export const profile = async (req, res, next) => {
    try {
        const token = req.cookies.token; // utiliza el mismo nombre de cookie que en la función login
        if (token) {
            // verifica el token y decodifica los datos del usuario
            jwt.verify(token, process.env.JWT_KEY, {}, (err, user) => {
                if (err) {
                    // si hay un error en la verificación del token, devuelve un error
                    return next(err);
                }
                // devuelve los datos del usuario, incluido 'isEmployee'
                res.json(user);
            });
        } else {
            // si no hay token, devuelve null
            res.json(null);
        }
    } catch (err) {
        next(err);
    }
}

export const logout = async (req, res, next) => {
    try {
        // se borra el token del usuario estableciendo una cookie vacía y con una fecha de expiración en el pasado
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production", 
          });
          res.status(200).json({ success: true });
          
    } catch (err) {
        next(err);
    }
};