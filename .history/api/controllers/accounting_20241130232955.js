import Accounting from '../models/Accounting.js';
import PaymentStatus from '../models/PaymentStatus.js';
import PaymentHistory from '../models/PaymentHistory.js';


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
            totalAmount: req.body.totalAmount,
            remainingAmount:  req.body.remainingAmount,
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
        const accounting = await Accounting.find().populate('status').populate('user', ['first_name','last_name']).populate('lodge', 'name').populate('tent');
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

export const addPartialPayment = async (req, res, next) => {
    try {
        const { id } = req.params; // ID de la entrada de Accounting
        const { additionalAmount } = req.body; // Monto adicional pagado

        // Encuentra el registro de contabilidad por ID
        const accounting = await Accounting.findById(id);

        if (!accounting) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        // Actualiza el saldo restante y verifica si ya está completamente pagado
        const newRemainingAmount = accounting.remainingAmount - additionalAmount;

        if (newRemainingAmount < 0) {
            return res.status(400).json({ message: "El monto excede el saldo restante" });
        }

        accounting.remainingAmount = newRemainingAmount;

        // Actualiza el estado si el saldo restante llega a cero
        if (newRemainingAmount === 0) {
            const paidStatus = await PaymentStatus.findOne({ status: "pagada" });
            accounting.status = paidStatus._id;
        }

        // Guarda el registro actualizado
        await accounting.save();

        // Registra el pago adicional como un nuevo ingreso
        const partialPayment = new Accounting({
            amount: additionalAmount,
            type: "Ingreso",
            date: new Date(),
            user: accounting.user,
            lodge: accounting.lodge,
            comment: "Pago adicional",
            status: accounting.status,
            totalAmount: accounting.totalAmount,
            remainingAmount: newRemainingAmount,
        });

        await partialPayment.save();

        res.status(200).json({ message: "Pago parcial registrado con éxito", accounting });
    } catch (err) {
        next(err);
    }
};

export const getPaymentHistoryByLodge = async (req, res, next) => {
    try {
      const { lodgeId } = req.params;
  
      console.log("ID recibido:", lodgeId);
  
      // Busca en lodges primero
      let payments = await Accounting.find({ lodge: lodgeId }).sort({ date: 1 });
  
      // Si no se encuentran pagos asociados a un lodge, buscar en tents
      if (payments.length === 0) {
        console.log("No se encontraron pagos para lodge, buscando en tents...");
        payments = await Accounting.find({ tent: lodgeId }).sort({ date: 1 });
      }
  
      // Devuelve los resultados encontrados o un mensaje indicando que no hay pagos
      if (payments.length > 0) {
        res.status(200).json(payments);
      } else {
        res.status(404).json({ message: "No se encontraron pagos para esta reserva." });
      }
    } catch (err) {
      next(err);
    }
  };


 export const paymentHistory = async (req, res, next) => {
    try {
 
      const { amount } = req.body;
      const accounting = await Accounting.findById(req.params.id).populate('status');
     
  
      if (!accounting) {
        return res.status(404).json({ message: 'Registro no encontrado' });
      }
  
      const newRemainingAmount = accounting.remainingAmount - amount;
      const newStatus = newRemainingAmount <= 0 ? 'pagada' : 'parcial';
      console.log("Nuevo estado calculado:", newStatus);
  
      accounting.remainingAmount = newRemainingAmount;
      accounting.status = await PaymentStatus.findOne({ status: newStatus });
      console.log("Estado actualizado en Accounting:", accounting.status);
  
      try {
        await accounting.save();
        console.log("Accounting guardado correctamente.");
      } catch (err) {
        console.error("Error al guardar Accounting:", err);
        return res.status(500).json({ message: 'Error al actualizar Accounting', error: err });
      }
  
      const paymentHistory = new PaymentHistory({
        accounting: accounting._id,
        amount,
        status: accounting.status._id,
      });
      console.log("Datos a guardar en PaymentHistory:", paymentHistory);
  
      await paymentHistory.save();
      res.status(200).json({ accounting, paymentHistory });
    } catch (error) {
      console.error("Error general:", error);
      res.status(500).json({ message: 'Error al registrar el pago', error });
    }
  };
  