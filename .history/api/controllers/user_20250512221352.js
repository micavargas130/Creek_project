import User from "../models/User.js"
import bycrypt from "bcryptjs"


export default User;

export const updateUser = async(req, res, next) =>{
    try{
        const updateUser = await User.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true})  
        res.status(200).json(updateUser)
    }catch(err) {
        next(err);
    }
}

export const deleteUser = async(req, res, next) =>{
    try{
        await User.findByIdAndDelete(req.params.id) //busca el lodge con el id que le pasamos 
        res.status(200).json("Usuario eliminado")
    }catch(err) {
        next(err);
    }
}

export const getUser = async(req, res, next) =>{
    try{
        const user = await User.findById(req.params.id) //busca el lodge con el id que le pasamos 
         res.status(200).json(user)
     }catch(err) {
        next(err);
     }
}

export const getUsers = async(req, res, next) =>{
    try{
        const users = await User.find() //busca el lodge con el id que le pasamos 
         res.status(200).json(users)
     }catch(err) {
         next(err)
     }

}

export const changePassword = async (req, res) => {
    try {
        const { password } = req.body;

        // Generar salt y hashear la nueva contraseña
        const salt = bycrypt.genSaltSync(10);
        const hash = bycrypt.hashSync(password, salt);

        // Actualizar la contraseña en la base de datos
        await User.findByIdAndUpdate(req.params.id, { password: hash });

        res.sendStatus(200);
    } catch (err) {
        console.error("Error with pass:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// routes/users.js
export const searchbyEmail = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email });
      if (!user) return res.status(200).json(null); // No error, solo null
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: "Error al buscar usuario" });
    }
  });
  