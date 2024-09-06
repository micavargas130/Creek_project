import express from 'express';
import { createAccounting, getAccounting, deleteAccounting, setComment, updatePaymentStatus, updatePaymentStatus } from '../controllers/accounting.js';

const router = express.Router();

router.post('/', createAccounting);
router.get('/', getAccounting);
router.delete('/:id', deleteAccounting);
router.put('/:id/comment', setComment);
router.post('/:accountingId/status', updatePaymentStatus);
router.put(`/accounting/$/status`,updatePaymentStatus);

export default router;
