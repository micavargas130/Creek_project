import Accounting from '../models/Accounting.js';
import PaymentStatus from '../models/PaymentStatus.js';
import PaymentHistory from '../models/PaymentHistory.js';
import Price from "../models/Prices.js"; 
import multer from "multer";
import fs from "fs";
import path from "path";

export const createAccounting = async (req, res, next) => {
  try {
    // Buscar el estado de pago
    const paymentStatus = await PaymentStatus.findOne({ status: req.body.status });
    if (!paymentStatus) {
      return res.status(404).json({ message: "Estado de pago no encontrado" });
    }

    // Determinar si es lodge o tent y traer el último precio
    let lastPrice = null;
    if (req.body.lodge) {
      lastPrice = await Price.findOne({ category: "cabañas" }).sort({ createdAt: -1 });
    } else if (req.body.tent) {
      lastPrice = await Price.findOne({ category: "carpas" }).sort({ createdAt: -1 });
    } else if (!req.body.lodge && !req.body.tent){
      lastPrice = req.body.amount;
    }

    if (!lastPrice) {
      return res.status(404).json({ message: "No se encontró un precio registrado para esta categoría" });
    }

    // Crear el nuevo registro de contabilidad
    const newAccounting = new Accounting({
      amount: req.body.amount,
      totalAmount: req.body.totalAmount,
      remainingAmount: req.body.remainingAmount,
      type: req.body.type,
      date: req.body.date,
      lodge: req.body.lodge,
      tent: req.body.tent,
      status: paymentStatus._id,
      price: lastPrice._id,
      comment: req.body.comment
    });

    const savedAccounting = await newAccounting.save();
    res.status(200).json(savedAccounting);

  } catch (err) {
    next(err);
  }
};

export const getAccountings = async (req, res, next) => {
  try {
    const accounting = await Accounting.find()
      .populate('status')
      .populate({
        path: 'lodge',
        populate: [
          {
            path: 'user',
            select: 'first_name last_name',
          },
          {
            path: 'lodge',
            select: 'name',
          }
        ]
      })
      .populate('tent');
      
    res.status(200).json(accounting);
  } catch (err) {
    next(err);
  }
};

export const getAccounting = async (req, res, next) => {
    try {
      const accounting = await Accounting.findById(req.params.id).populate('status').populate('lodge').populate('tent')
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
      } else if (filter === "all") { //devuelve todo
        dateRange = null; 
      }
  
      const filtro = {
        status: { $ne: "686f099aacd6f16c7fd3c905" }, // excluir status cancelado
        ...(dateRange && { date: dateRange })        // incluir rango de fechas si existe
      };
      
      const accounting = await Accounting.find(filtro);
  
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

export const getAccountingByBooking = async (req, res, next) => {
  try {
      const { bookingId } = req.params;
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
        const paymentStatus = await PaymentStatus.findOne({ status });

        if (!paymentStatus) {
            return res.status(404).json({ message: "Estado de pago no encontrado" });
        }
        const updatedAccounting = await Accounting.findByIdAndUpdate(
            accountingId, 
            { status: paymentStatus._id },
            { new: true }
        ).populate('status'); 

        if (!updatedAccounting) {
            return res.status(404).json({ message: "Accounting not found" });
        }

        res.status(200).json(updatedAccounting);
    } catch (err) {
        next(err);
    }
};

export const addCommentToAccounting = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const accounting = await Accounting.findByIdAndUpdate(
      req.params.id,
      { comment },
      { new: true }
    );

    if (!accounting) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.status(200).json(accounting);
  } catch (err) {
    next(err);
  }
};


export const addPartialPayment = async (req, res, next) => {
    try {
        const { id } = req.params; // ID de la entrada de Accounting
        const { additionalAmount } = req.body; // Monto adicional pagado

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
            const paidStatus = await PaymentStatus.findOne({ status: "pagado" });
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

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "api/public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export const uploadReceipt = async (req, res, next) => {
  upload.array("receipt", 5)(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No se subió ninguna imagen." });
      }

      const paymentId = req.params.id; 
      const payment = await PaymentHistory.findById(paymentId);
      if (!payment) {
        return res.status(404).json({ message: "Pago no encontrado" });
      }

      const filePaths = req.files.map((file) => `uploads/${file.filename}`);
      payment.receipt = [...(payment.receipt || []), ...filePaths];
      await payment.save();

      return res.status(200).json({
        message: "Comprobante(s) subido(s) exitosamente.",
        payment,
      });
    } catch (error) {
      console.error("Error al subir comprobante:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });
};

export const deleteReceipt = async (req, res, next) => {
  try {
    const { paymentId } = req.params; 
    const { receiptPath } = req.body; 

    const payment = await PaymentHistory.findById(paymentId);
    if (!payment) return res.status(404).json("Pago no encontrado");

    const toDelete = receiptPath || payment.receipt?.[0];
    if (!toDelete) return res.status(404).json("No hay comprobante que eliminar");

    const diskPath = path.join(
      process.cwd(),
      "api/public/uploads",
      path.basename(toDelete)
    );
    console.log("Intentando borrar archivo:", diskPath);

    if (fs.existsSync(diskPath)) {
      fs.unlinkSync(diskPath);
    }

    payment.receipt = payment.receipt.filter((p) => p !== toDelete);
    await payment.save();

    return res.status(200).json("Comprobante eliminado correctamente");
  } catch (error) {
    console.error("Error en deleteReceipt:", error);
    return next(error);
  }
};
export const returnPayment = async (req, res, next) => {
  try { 
    const amount = req.body.amount;
    const accounting = await Accounting.findById(req.params.id);
    console.log("amount",amount);

    if (!accounting) {
            return res.status(404).json({ message: 'Registro de contabilidad no encontrado' });     
    }

    const status = await PaymentStatus.findOne({ status: req.body.status });

   //Crear un nuevo registro en PaymentHistory
    const paymentHistory = new PaymentHistory({
        accounting: accounting._id,
        amount: 0 - req.body.amount,
        status: status._id, 
    });

    console.log("payment", paymentHistory);
    await paymentHistory.save();

    //Actualizar el registro de Accounting
    accounting.amount = amount;
    accounting.status = status._id; // Cambia el estado de accounting
    await accounting.save(); 
  
    res.status(200).json({ message: "Reenbolso registrado", paymentHistory, accounting });
  } catch (error) {
        console.error("Error al registrar el pago:", error);
        res.status(500).json({ message: 'Error al registrar el pago', error });
    }

}; 
export const paymentHistory = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const accounting = await Accounting.findById(req.params.accountingId);

        if (!accounting) {
            return res.status(404).json({ message: 'Registro de contabilidad no encontrado' });     
        }

        // Calcular el nuevo saldo restante
        const newRemainingAmount = accounting.remainingAmount - amount;
        let newStatus;
        const depositAmount = accounting.totalAmount * 0.3;

        if (newRemainingAmount <= 0) {
          newStatus = "pagado";
        } else if (amount === depositAmount) {
          newStatus = "seña";
        } 
        else {
          newStatus = "parcial";
        }
        const status = await PaymentStatus.findOne({ status: newStatus });

        //Crear un nuevo registro en PaymentHistory
        const paymentHistory = new PaymentHistory({
            accounting: accounting._id,
            amount,
            status: status._id, 
        });

        await paymentHistory.save();

        //Actualizar el registro de Accounting
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

export const getPaymentHistoryByEntity = async (req, res, next) => {
  try {
    const { bookingId, type } = req.params;

    if (!["lodge", "tent"].includes(type)) {
      return res.status(400).json({ message: "Tipo de entidad no válido." });
    }

    const query = {};
    query[type] = bookingId;

    const accountingRecords = await Accounting.find(query);

    if (accountingRecords.length === 0) {
      return res.status(404).json({ message: "No se encontraron registros contables para esta reserva." });
    }

    const accountingIds = accountingRecords.map((a) => a._id);

    const paymentHistory = await PaymentHistory.find({
      accounting: { $in: accountingIds },
    })
      .populate("status")
      .sort({ date: 1 });

    res.status(200).json(paymentHistory);
  } catch (err) {
    next(err);
  }
};

  