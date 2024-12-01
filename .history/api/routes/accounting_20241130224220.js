import express from 'express';
import { createAccounting, getAccountings, getAccounting, getPaymentHistoryByLodge, completePayment, deleteAccounting, setComment, updatePaymentStatus } from '../controllers/accounting.js';

const router = express.Router();

//POST
router.post('/createAccounting', createAccounting);

//PUT
router.put('/comment/:id', setComment);
router.put('/status/:id', updatePaymentStatus);
router.put('/history/:id', updatePaymentStatus);
router.put('')

//GET
router.get('/:id', getAccounting);
router.get('/', getAccountings);
router.get('/history/:lodgeId', getPaymentHistoryByLodge);


//DELETE
router.delete('/:id', deleteAccounting);




export default router;
