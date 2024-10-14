import express from 'express';
import { createAccounting, getAccountings, getAccounting, deleteAccounting, setComment, updatePaymentStatus } from '../controllers/accounting.js';

const router = express.Router();

//PUT

//POST
router.post('/createAccounting', createAccounting);
router.put('/status/:id', updatePaymentStatus);

//GET
router.get('/:id', getAccounting);
router.get('/', getAccountings);

//DELETE
router.delete('/:id', deleteAccounting);




export default router;
