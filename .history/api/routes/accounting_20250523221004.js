import express from 'express';
import { createAccounting, getAccountings, getAccounting, paymentHistory, getPaymentHistoryByLodge, deleteAccounting, updatePaymentStatus, getAccountingByFilter, getAccountingByBooking, deleteReceipt, uploadReceipt } from '../controllers/accounting.js';

const router = express.Router();

//POST
router.post('/createAccounting', createAccounting);
router.post('/pay/:accountingId', paymentHistory);
router.post( "/pay/receipt/:id",  uploadReceipt );

//PUT
router.put('/status/:id', updatePaymentStatus);
router.put('/history/:id', updatePaymentStatus);

//GET
router.get('/filter', getAccountingByFilter);
router.get('/:id', getAccounting);
router.get('/', getAccountings);
router.get('/history/history/:type/:bookingId', getPaymentHistoryByLodge);
router.get('/booking/:bookingId', getAccountingByBooking);

//DELETE
router.delete('/:id', deleteAccounting);
router.delete('/pay/receipt/:paymentId', deleteReceipt);

export default router;
