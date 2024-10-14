import Accounting from '../models/Accounting.js';
import PaymentStatus from '../models/PaymentStatus.js';

export const createAccounting = async (req, res, next) => {
    try {

        const paymentStatus = await PaymentStatus.findOne({status:"pagada"});
        // Crear la nueva entrada en Accounting
        const newAccounting = new Accounting({
            amount: req.body.amount,
            type: req.body.type,
            date: req.body.date,
            user: req.body.user,
            cabain: req.body.cabain,
            comment: req.body.comment,
            status: paymentStatus._id,
        });

        const savedAccounting = await newAccounting.save();

        res.status(200).json(savedAccounting);
    } catch (err) {
        next(err);
    }
};


export const getAccounting = async (req, res, next) => {
    try {
        const accounting = await Accounting.find().populate('status');
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
        const accountingId = req.params.accountingId;
        const { status } = req.body;

        const newStatus = new PaymentStatus({
            status,
            accounting: accountingId,
        });

        await newStatus.save();

        const accounting = await Accounting.findById(accountingId);
        accounting.status.push(newStatus._id);
        await accounting.save();

        res.status(200).json(newStatus);
    } catch (err) {
        next(err);
    }
};
