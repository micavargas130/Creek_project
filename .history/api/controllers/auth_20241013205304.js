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


import bcrypt from "bcryptjs"; // Asegúrate de importar bcrypt

export const createEmployee = async (req, res, next) => {
    const { email, first_name, last_name, dni, phone, birthday, job, base_salary, start_date, photo } = req.body;

    try {
        // Encriptar la contraseña por defecto "0camping" antes de crear el usuario
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("0camping", salt);

        // Crear el usuario con la contraseña encriptada
        const newUser = new User({
            email,
            password: hashedPassword,  // Contraseña encriptada
            first_name,
            last_name,
            dni,
            phone,
            birthday,
            isEmployee: true
        });

        const savedUser = await newUser.save();

        // Obtener el estado por defecto (e.g., "Activo")
        const defaultStatus = await Status.findOne({ name: "Activo" });

        // Crear el empleado asociado al usuario y al estado por defecto
        const newEmployee = new Employee({
            user: savedUser._id,
            job,
            base_salary,
            start_date,
            photo,
            status: defaultStatus._id
        });

        const savedEmployee = await newEmployee.save();

        res.status(200).json(savedEmployee);
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
export const logout = async (req, res, next) => {
    try {
        // Borra el token del usuario estableciendo una cookie vacía y con una fecha de expiración en el pasado
        res.clearCookie("token").status(200).json(true);
    } catch (err) {
        next(err);
    }
};