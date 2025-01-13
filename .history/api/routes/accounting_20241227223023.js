import express from 'express';
import { createAccounting, getAccountings, getAccounting, paymentHistory, ge getPaymentHistoryByLodge, deleteAccounting, setComment, updatePaymentStatus } from '../controllers/accounting.js';
import PaymentHistory from '../models/PaymentHistory.js';

const router = express.Router();

//POST
router.post('/createAccounting', createAccounting);
router.post('/pay/:id', paymentHistory);

//PUT
router.put('/comment/:id', setComment);
router.put('/status/:id', updatePaymentStatus);
router.put('/history/:id', updatePaymentStatus);


//GET
router.get('/:id', getAccounting);
router.get('/', getAccountings);
router.get('/history/:lodgeId', getPaymentHistoryByLodge);


//DELETE
router.delete('/:id', deleteAccounting);




export default router;
