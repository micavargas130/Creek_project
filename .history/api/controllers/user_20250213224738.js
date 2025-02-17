import User from "../models/User.js"

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
        await User.findByIdA(req.params.id) //busca el lodge con el id que le pasamos 
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
        // Utiliza req.params.id para acceder al ID del usuario desde la ruta
        await User.findByIdAndUpdate(req.params.id, { password });
        res.sendStatus(200);
    } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}