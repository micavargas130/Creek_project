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
    res.status(200).send("User registered succesfully")
        
    }catch(err){
        next(err);
    }
}


export const login = async (req, res, next) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user) {return next(createError(404, "User not found"))};

        const isPasswordCorrect = await bycrypt.compare(req.body.password, user.password)
        
        if(!isPasswordCorrect) {return next(createError(400, "Incorrect password or email"));}


        //usamos este token para verificar la informacion de cada usuario y saber si es admin o no 
        const token = jwt.sign({id:user._id, email: user.email, first_name: user.first_name, last_name: user.last_name, isEmployee: user.isEmployee, isAdmin: user.isAdmin}, process.env.JWT_KEY, {}, (err,token) =>{
            if(err) throw err; 
            res.cookie("token", token,).status(200).json(user); 
        });

        const { password, isAdmin, ...otherDetails } = user._doc;
    
    }catch(err){

        next(err);
    }
}

export const login ="/change-password", async (req, res) => {
    try {
      const { userId } = req.user; // Obtén el ID del usuario desde el token
      const { newPassword } = req.body;
      // Encuentra al usuario en la base de datos y actualiza la contraseña
      await User.findByIdAndUpdate(userId, { password: newPassword });
      res.sendStatus(200);
    } catch (err) {
      console.error("Error changing password:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

export const profile = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (token) {
            // Verifica el token y decodifica los datos del usuario
            jwt.verify(token, process.env.JWT_KEY, {}, (err, user) => {
                if (err) throw err;
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

export const logout = async (req, res,next) => {
    try{
    res.cookie('token','').json(true);
     
      } catch(err) {next(err);} 
  }