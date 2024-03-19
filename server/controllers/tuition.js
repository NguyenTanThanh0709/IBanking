// controllers/tuition.js
import TuitionModel from '../models/TuitionModel.js';
import UserModel from '../models/UserModel.js';
import TransactionHistoryModel from '../models/TransactionHistoryModel.js'; // Đảm bảo rằng bạn đã import mô hình TransactionHistoryModel

const TransactionHistoryService = {
  async insertTransaction( tuitionId, status) {
    try {
      const transaction = new TransactionHistoryModel({
        payment_date: Date.now(),
        tuition: tuitionId,
        status: status
      });
      const savedTransaction = await transaction.save();
      return savedTransaction;
    } catch (error) {
      throw new Error(`Failed to insert transaction: ${error.message}`);
    }
  }
};

export const findTuitionsByUser = async (req, res) => {
    try {
        const mssv = req.params.id;
        const user = await UserModel.findOne({ mssv: mssv })
        if (!user) {
            throw new Error('User not found');
        }
        // Find tuition records related to the user and populate the user information
        // console.log(user)
        const tuitions = await TuitionModel.find({ user: user._id }).populate('user');
        res.status(200).json(tuitions);
    } catch (error) { 
        res.status(500).json({ error: error.message });
    }
};

