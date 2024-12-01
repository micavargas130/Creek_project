import express from 'express';
import { createAccounting, getAccountings, getAccounting, deleteAccounting, setComment, updatePaymentStatus } from '../controllers/accounting.js';

const router = express.Router();

//POST
router.post('/createAccounting', createAccounting);

//PUT
router.put('/comment/:id', setComment);
router.put('/status/:id', updatePaymentStatus);

//GET
router.get('/:id', getAccounting);
router.get('/', getAccountings);
router.get('/accounting/history/lodge/:lodgeId', getPaymentHistoryByLodge);


//DELETE
router.delete('/:id', deleteAccounting);




export default router;
