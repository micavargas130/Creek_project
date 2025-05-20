import express from 'express';
import { createAccounting, getAccountings, getAccounting, paymentHistory, getPaymentHistoryByLodge, deleteAccounting, updatePaymentStatus, getAccountingByFilter, getAccountingByBooking } from '../controllers/accounting.js';

const router = express.Router();

//POST
router.post('/createAccounting', createAccounting);
router.post('/pay/:id', paymentHistory);

//PUT
router.put('/status/:id', updatePaymentStatus);
router.put('/history/:id', updatePaymentStatus);
router.post(
    "/accounting/pay/:id",
    upload.array("receipts"), // nombre del campo en el formulario
    paymentHistory
  );


//GET
router.get('/filter', getAccountingByFilter);
router.get('/:id', getAccounting);
router.get('/', getAccountings);
router.get('/history/:bookingId', getPaymentHistoryByLodge);
router.get('/booking/:bookingId', getAccountingByBooking);



//DELETE
router.delete('/:id', deleteAccounting);

export default router;
