import express from 'express';
import {
    addNewUser,
    getUserById,
    getUserByMSSV,
    loginUser
} from '../controllers/login.js'; // Adjust the path accordingly

const   router = express.Router();

router.post('/add', addNewUser);
router.get('/:id', getUserById);
router.get('/mssv/:mssv', getUserByMSSV);
router.post('/login', loginUser);

export default router;
