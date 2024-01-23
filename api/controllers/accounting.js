import User from '../controllers/user.js';
import Accounting from '../models/Accounting.js';

export const createAccounting = async (req, res, next) =>{ 
 try{
        const newAccounting = new Accounting({
        amount: req.body.amount,
        type: req.body.type,
        date: req.body.date,
        user: req.body.user,
        cabain: req.body.cabain,
        comment: req.body.comment,
    })
    await newAccounting.save();
    res.status(200).send('Accounting registered correctly');

    }catch(err){
        next(err);
    }

}


export const getAccounting = async(req, res, next) =>{
    try{
        const accounting = await Accounting.find() 
         res.status(200).json(accounting)
     }catch(err) {
         next(err)
     }

}


export const deleteAccounting = async (req, res, next) => {
    try {
      const accountingId = req.params.id;
      const deletedAccounting = await Accounting.findByIdAndDelete(accountingId);
      
      if (!deletedAccounting) {
        return res.status(404).json({ message: 'Accounting not found' });
      }
      
      res.status(200).json({ message: 'Accounting deleted successfully' });
    } catch (err) {
      next(err);
    }
  };

  export const setComment = async (req, res, next) => {
    try {
      const accountingId = req.params.id;
      const { comment } = req.body;
  
      // Realiza la actualización en la base de datos
      const updatedAccounting= await Accounting.findByIdAndUpdate(accountingId,{comment} , { new: true });
  
      // Devuelve la cabaña actualizada como respuesta
      res.json(updatedAccounting);
    } catch (error) {
      console.error('Error al poner la cabaña en mantenimiento con comentario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
