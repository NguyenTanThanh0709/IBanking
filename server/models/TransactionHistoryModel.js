import mongoose, {Schema, ObjectId } from 'mongoose'
export default mongoose.model('TransactionHistoryModel',
    new Schema({
        id: { type: ObjectId},
        payment_date: {
            type: String,
            required: true
        },
        tuition: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TuitionModel', // Replace with the actual name of your Tenant model
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel', // Replace with the actual name of your Tenant model
            required: true,
        },

        status: {
            type: Boolean,
            required: true
        },
        method: String
    })  
)