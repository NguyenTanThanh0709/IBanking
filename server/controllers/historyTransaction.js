import TransactionHistoryModel from '../models/TransactionHistoryModel.js';
import TuitionModel from '../models/TuitionModel.js';
// Controller để tạo một giao dịch mới
export const createTransaction = async (req, res) => {
    try {
        const {tuitionId,userId, status1, method } = req.body;
        // Lấy ngày hiện tại và chuyển đổi thành chuỗi ngày tháng
        const payment_date = new Date().toISOString();

        // Tạo một đối tượng giao dịch mới
        const transaction = new TransactionHistoryModel({
            payment_date,
            tuition: tuitionId,
            user: userId,
            status1,
            method
        });

        // Lưu giao dịch vào cơ sở dữ liệu
        const savedTransaction = await transaction.save();

        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller để cập nhật một giao dịch theo ID của khoản học phí
export const updateTransactionByTuitionId = async (req, res) => {
    try {
        const tuitionId = req.params.tuitionId;
        const {  userId,status1, method } = req.body;
        const payment_date = new Date().toISOString();
        console.log(tuitionId,userId,status1,method)
        const updatedTuition = await TuitionModel.findByIdAndUpdate(
            tuitionId,
            { status: true }, // Specify the field you want to update and its new value
            { new: true }
        );
        console.log(updatedTuition)
        if (updatedTuition) {

           const history = new TransactionHistoryModel({
                payment_date,
                tuition: tuitionId,
                user: userId,
                status: true, // Assuming status1 is meant to be the value of the 'status' field
                method
            });
            const savedTransaction = await history.save();
            if (savedTransaction) {
                res.status(201).json(savedTransaction);
            }
            
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller để lấy ra các giao dịch dựa trên người dùng
export const getTransactionsByUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Đảm bảo bạn đã có route để truyền userId

        // Tìm kiếm các giao dịch dựa trên user
        const transactions = await TransactionHistoryModel.find({ user: userId })
        .populate({
            path: 'tuition',
          })
          .populate({
            path: 'user',
          });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};