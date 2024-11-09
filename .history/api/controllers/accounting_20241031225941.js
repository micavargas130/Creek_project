import Accounting from '../models/Accounting.js';
import PaymentStatus from '../models/PaymentStatus.js';


export const createAccounting = async (req, res, next) => {
    try {
        // Busca el estado basado en el estado proporcionado en la solicitud
        const paymentStatus = await PaymentStatus.findOne({ status: req.body.status });
        
        if (!paymentStatus) {
            return res.status(404).json({ message: "Estado de pago no encontrado" });
        }

        // Crear la nueva entrada en Accounting
        const newAccounting = new Accounting({
            amount: req.body.amount,
            type: req.body.type,
            date: req.body.date,
            user: req.body.user,
            lodge: req.body.lodge,
            tent: req.body.tent,
            comment: req.body.comment,
            status: paymentStatus._id,
        });

        const savedAccounting = await newAccounting.save();
        res.status(200).json(savedAccounting);
    } catch (err) {
        next(err);
    }
};


export const getAccountings = async (req, res, next) => {
    try {
        const accounting = await Accounting.find().populate('status').populate('user', ['first_name','last_name'];
        res.status(200).json(accounting);
    } catch (err) {
        next(err);
    }
};

export const getAccounting = async (req, res, next) => {
    try {
      const accounting = await Accounting.findById(req.params.id).populate('status');
      res.status(200).json(accounting);
    } catch (err) {
      next(err);
    }
  };

export const deleteAccounting = async (req, res, next) => {
    try {
        const accountingId = req.params.id;
        const deletedAccounting = await Accounting.findByIdAndDelete(accountingId);

        if (!deletedAccounting) {
            return res.status(404).json({ message: 'Accounting not found' });
        }

        await PaymentStatus.deleteMany({ accounting: accountingId });

        res.status(200).json({ message: 'Accounting deleted successfully' });
    } catch (err) {
        next(err);
    }
};

export const setComment = async (req, res, next) => {
    try {
        const accountingId = req.params.id;
        const { comment } = req.body;

        const updatedAccounting = await Accounting.findByIdAndUpdate(accountingId, { comment }, { new: true });

        res.json(updatedAccounting);
    } catch (error) {
        console.error('Error al poner la cabaña en mantenimiento con comentario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



export const updatePaymentStatus = async (req, res, next) => {
    try {
        const accountingId = req.params.id;
        const { status } = req.body;

        // Busca el estado basado en el valor proporcionado en la solicitud
        const paymentStatus = await PaymentStatus.findOne({ status });

        if (!paymentStatus) {
            return res.status(404).json({ message: "Estado de pago no encontrado" });
        }

        // Actualiza el estado en el documento de Accounting
        const updatedAccounting = await Accounting.findByIdAndUpdate(
            accountingId, 
            { status: paymentStatus._id },
            { new: true }
        ).populate('status'); // Usamos populate para devolver la información completa del estado

        if (!updatedAccounting) {
            return res.status(404).json({ message: "Accounting not found" });
        }

        res.status(200).json(updatedAccounting);
    } catch (err) {
        next(err);
    }
};