import UserModel from "../models/UserModel.js";
import TuitionModel from "../models/TuitionModel.js";
import jwt from 'jsonwebtoken'
const addNewUser = async (req, res) => {
    try {
        const newUser = new UserModel(req.body);
        const savedUser = await newUser.save();

        const startYear = savedUser.start;
        const endYear = savedUser.end;

        const tuitions = [];
        for (let year = startYear; year < endYear; year++) {
            const tuition = {
                start: year,
                end: year + 1,
                fee: Math.floor(Math.random() * (20000000 - 5000000 + 1)) + 5000000, // Random fee between 5,000,000 and 20,000,000
                status: false,
                user: savedUser.mssv,
            };
            tuitions.push(tuition);
        }
// Save all tuition records in a single operation
        await TuitionModel.insertMany(tuitions);
        res.json({ user: savedUser, tuitions });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserByMSSV = async (req, res) => {
    try {
        const user = await UserModel.findOne({ mssv: req.params.mssv });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { mssv, password } = req.body;
    // console.log(mssv, password);
    try {
        const user = await UserModel.findOne({ mssv, password });

        if (user) {
            let token = jwt.sign({
                data: user
              }, 
              process.env.JWT_SECRET,{
                expiresIn: '30d'
              }          
            );

            res.json({
                ...user.toObject(),
                token: token
            });

        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    addNewUser,
    getUserById,
    getUserByMSSV,
    loginUser
};