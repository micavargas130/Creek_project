import express from 'express';
import { createAccounting, getAccounting, deleteAccounting, setComment, updatePaymentStatus } from '../controllers/accounting.js';

const router = express.Router();

router.post('/', createAccounting);
router.get('/', getAccounting);
router.delete('/:id', deleteAccounting);
router.put('/comment/:id', setComment);
router.post('/status/:id', updatePaymentStatus);


export default router;
