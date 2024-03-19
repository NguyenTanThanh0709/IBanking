import express from 'express';
import {
    createTransaction,
    updateTransactionByTuitionId,
    getTransactionsByUser
} from '../controllers/historyTransaction.js'; // Adjust the path accordingly

const   router = express.Router();

// Route để tạo một giao dịch mới
router.post('/', createTransaction);
// Route để cập nhật thông tin giao dịch theo ID của khoản học phí
router.put('/:tuitionId', updateTransactionByTuitionId);

// Route để lấy ra thông tin giao dịch dựa trên ID của khoản học phí
router.get('/user/:userId', getTransactionsByUser);

export default router;
