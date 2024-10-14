import express from 'express';
import { createAccounting, getAccountings, deleteAccounting, setComment, updatePaymentStatus } from '../controllers/accounting.js';

const router = express.Router();

router.post('/', createAccounting);
router.put('/status/:id', updatePaymentStatus);
router.get('/', getAccountings);
router.get('/', getAccountings);
router.delete('/:id', deleteAccounting);
router.put('/comment/:id', setComment);



export default router;
