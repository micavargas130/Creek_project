import express from 'express';
import { createAccounting, getAccountings, getAccounting, returnPayment, paymentHistory, getPaymentHistoryByEntity, deleteAccounting, updatePaymentStatus, getAccountingByFilter, getAccountingByBooking, deleteReceipt, uploadReceipt, addCommentToAccounting } from '../controllers/accounting.js';
import { verifyStaff } from "../utils/verifyToken.js";

const router = express.Router();

//todo lo de contabilidad es solo para el staff
router.use(verifyStaff);

//POST
router.post('/createAccounting', createAccounting);
router.post('/pay/:accountingId', paymentHistory);
router.post( "/pay/receipt/:id",  uploadReceipt );
router.post( "/return/:id",  returnPayment );


//PUT
router.put('/status/:id', updatePaymentStatus);
router.put('/history/:id', updatePaymentStatus);

//PATCH
router.put("/comment/:id", addCommentToAccounting);

//GET
router.get('/filter', getAccountingByFilter);
router.get('/:id', getAccounting);
router.get('/', getAccountings);
router.get('/history/:type/:bookingId', getPaymentHistoryByEntity);
router.get('/booking/:bookingId', getAccountingByBooking);

//DELETE
router.delete('/:id', deleteAccounting);
router.delete('/pay/receipt/:paymentId', deleteReceipt);

export default router;
