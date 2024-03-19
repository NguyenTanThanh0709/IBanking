import mongoose, {Schema, ObjectId } from 'mongoose'
export default mongoose.model('OtpModel',
    new Schema({
        email: String,
        hashOtp: String,
        time: {type: Date, default: Date.now, index:{expires:60}}
    })
)