import express from 'express';
import { createAccounting, getAccountings, getAccounting, deleteAccounting, setComment, updatePaymentStatus } from '../controllers/accounting.js';

const router = express.Router();

router.post('/createAccounting', createAccounting);
router.put('/status/:id', updatePaymentStatus);
router.get('/', getAccountings);
router.get('/:id', getAccounting);
router.delete('/:id', deleteAccounting);
router.put('/comment/:id', setComment);



export default router;