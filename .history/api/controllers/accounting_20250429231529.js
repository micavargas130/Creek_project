import Accounting from '../models/Accounting.js';
import PaymentStatus from '../models/PaymentStatus.js';
import PaymentHistory from '../models/PaymentHistory.js';


export const createAccounting = async (req, res, next) => {
    try {
        // Busca el estado basado en el estado proporcionado en la solicitud
        const paymentStatus = await PaymentStatus.findOne({ status: req.body.status });
        console.log("paymentStatus", paymentStatus)
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
            lodge: req.body.lodge,
            tent: req.body.tent,
            comment: req.body.comment,
            status: paymentStatus._id,
        });

        console.log("reigstro final", newAccounting)

        const savedAccounting = await newAccounting.save();
        
        res.status(200).json(savedAccounting);
    } catch (err) {
        next(err);
    }
};


export const getAccountings = async (req, res, next) => {
    try {
        const accounting = await Accounting.find().populate('status').populate({
          'lodge'
    
          
        }).populate('tent');
        res.status(200).json(accounting);
    } catch (err) {
        next(err);
    }
};

export const getAccounting = async (req, res, next) => {
    try {
      const accounting = await Accounting.findById(req.params.id).populate('status').populate({
        path: 'lodge', // Popula el campo booking
        populate: {
          path: 'lodge', 
          select: 'name', 
        },
      }).populate('tent')
      res.status(200).json(accounting);;
      res.status(200).json(accounting);
    } catch (err) {
      next(err);
    }
  };

  export const getAccountingByFilter = async (req, res, next) => {
    try {
      const { filter } = req.query;
      let dateRange = {};
      const now = new Date();
    
  
      if (filter === "day") {
        dateRange = {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lte: new Date(now.setHours(23, 59, 59, 999)),
        };
      } else if (filter === "month") {
        dateRange = {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
        };
      } else if (filter === "year") {
        dateRange = {
          $gte: new Date(now.getFullYear(), 0, 1),
          $lte: new Date(now.getFullYear(), 11, 31, 23, 59, 59),
        };
      } else if (filter === "all") {
        // No establezcas un rango de fechas, devuelve todos los documentos
        dateRange = null; 
      }
  
      // Condicionalmente aplica el filtro por fechas si existe un rango
      const accounting = await Accounting.find(
        dateRange ? { date: dateRange } : {}
      );
  
      if (!accounting.length) {
        console.log("No entries found for date range:", dateRange);
      }
  
      const totalIncome = accounting
        .filter((entry) => entry.type === "Ingreso")
        .reduce((sum, entry) => sum + entry.amount, 0);
  
      const totalExpense = accounting
        .filter((entry) => entry.type === "Egreso")
        .reduce((sum, entry) => sum + entry.amount, 0);
  
      const totalMoney = totalIncome - totalExpense;
  
      res.status(200).json({ totalMoney, totalIncome, totalExpense });
    } catch (err) {
      console.error("Error in getAccountingByFilter:", err);
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

export const getAccountingByBooking = async (req, res, next) => {
  try {
      const { bookingId } = req.params;
      console.log("booking", bookingId)
      // Busca la contabilidad relacionada con la reserva específica
      const accounting = await Accounting.findOne({ lodge: bookingId })
          .populate('status')
          .populate('lodge')
          .populate('tent');

      if (!accounting) {
          return res.status(404).json({ message: "No se encontró un registro de contabilidad para esta reserva." });
      }

      res.status(200).json(accounting);
  } catch (err) {
      next(err);
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
      // Buscar el Accounting relacionado con la cabaña
      const accountingRecords = await Accounting.find({ lodge: lodgeId });

      if (accountingRecords.length === 0) {
          console.log("No se encontraron pagos para lodge, buscando en tents...");
          const accountingTents = await Accounting.find({ tent: lodgeId });

          if (accountingTents.length === 0) {
              return res.status(404).json({ message: "No se encontraron pagos para esta reserva." });
          }

          // Si existen pagos en tents, buscar su historial
          const paymentHistoryTents = await PaymentHistory.find({
              accounting: { $in: accountingTents.map(a => a._id) }
          }).sort({ date: 1 });

          return res.status(200).json(paymentHistoryTents);
      }

      // Buscar el historial de pagos que corresponda a los registros de Accounting encontrados
      const paymentHistory = await PaymentHistory.find({
          accounting: { $in: accountingRecords.map(a => a._id) }
      }).sort({ date: 1 });

      res.status(200).json(paymentHistory);
  } catch (err) {
      next(err);
  }
};


  export const paymentHistory = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const accounting = await Accounting.findById(req.params.id);

        if (!accounting) {
            return res.status(404).json({ message: 'Registro de contabilidad no encontrado' });
        }

        // Calcular el nuevo saldo restante
        const newRemainingAmount = accounting.remainingAmount - amount;
        
        let newStatus;
        if (amount === 0) {
          newStatus = "pendiente";
        } else if (newRemainingAmount <= 0) {
          newStatus = "pagada";
        } else {
          newStatus = "parcial";
        }

        // Obtener el estado correcto desde la base de datos
        const status = await PaymentStatus.findOne({ status: newStatus });


        // 1️⃣ Crear un nuevo registro en PaymentHistory
        const paymentHistory = new PaymentHistory({
            accounting: accounting._id,
            amount,
            status: status._id, 
        });

        await paymentHistory.save();

        // 2️⃣ Actualizar el registro de Accounting
        accounting.remainingAmount = newRemainingAmount <= 0 ? 0 : newRemainingAmount;
        const oldAmount = accounting.amount;
        accounting.amount = oldAmount + amount;
        accounting.status = status._id; // Cambia el estado de accounting
        await accounting.save(); 
        
      

        res.status(200).json({ message: "Pago registrado con éxito", paymentHistory, accounting });
    } catch (error) {
        console.error("Error al registrar el pago:", error);
        res.status(500).json({ message: 'Error al registrar el pago', error });
    }
};

  