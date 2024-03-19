import mongoose, {Schema, ObjectId } from 'mongoose'
export default mongoose.model('TuitionModel',
    new Schema({
        id: { type: ObjectId},
        start: { 
            type: Number, 
            required: true,
        },
        end: { 
            type: Number, 
            required: true,
        },
        fee: { 
            type: Number, 
            required: true,
        },
        status: { 
            type: Boolean, 
            required: true,
            default: false
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel',
            required: true,
        },
    })  
)