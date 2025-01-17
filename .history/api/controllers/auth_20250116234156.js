import User from "../models/User.js"
import bycrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken"


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
        console.log("body", req.body)
        console.log("email", req.body.email )
        console.log("password", req.body.password )
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(createError(404, "User not found"));
        }

        console.log(user);
        const isPasswordCorrect = await bycrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(400, "Incorrect password or email"));
        }

        // Usamos este token para verificar la información de cada usuario y saber si es admin o no 
        const token = jwt.sign({ id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name, isEmployee: user.isEmployee, isAdmin: user.isAdmin }, process.env.JWT_KEY);
        
        // Establece la cookie con el nombre "token"
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Solo en HTTPS
            sameSite: "none", // Necesario para solicitudes cross-origin
          }).status(200).json(user);
    } catch (err) {
        next(err);
    }
};


export const profile = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Utiliza el mismo nombre de cookie que en la función login
        if (token) {
            // Verifica el token y decodifica los datos del usuario
            jwt.verify(token, process.env.JWT_KEY, {}, (err, user) => {
                if (err) {
                    // Si hay un error en la verificación del token, devuelve un error
                    return next(err);
                }
                // Devuelve los datos del usuario, incluido 'isEmployee'
                res.json(user);
            });
        } else {
            // Si no hay token, devuelve null
            res.json(null);
        }
    } catch (err) {
        next(err);
    }
}


export const (req, res) => {
    mongoose.connection.db.admin().ping((err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database connection failed", error: err });
      }
      return res.status(200).json({ message: "Database connected successfully", result });
    });
  });
  
export const logout = async (req, res, next) => {
    try {
        // Borra el token del usuario estableciendo una cookie vacía y con una fecha de expiración en el pasado
        res.clearCookie("token").status(200).json(true);
    } catch (err) {
        next(err);
    }
};