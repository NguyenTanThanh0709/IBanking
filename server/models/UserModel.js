import mongoose, {Schema, ObjectId } from 'mongoose'
export default mongoose.model('UserModel',
    new Schema({
        id: { type: ObjectId},
        name: {
            type: String,
            required: true, //NOT NULL
        },
        mssv: {
            type: String,
            required: true, //NOT NULL
        },
        email: {
            type: String, 
            required: true, //NOT NULL
        },
        password: { 
            type: String, 
            required: true,            
        },
        phoneNumber: { 
            type: String, 
            required: true,
        },
        start: { 
            type: Number, 
            required: true,
        },
        end: { 
            type: Number, 
            required: true,
        },
    })  
)