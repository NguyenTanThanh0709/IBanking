import express from 'express';

import {
    findTuitionsByUser,
} from '../controllers/tuition.js';
const router = express.Router();

router.get('/:id', findTuitionsByUser);

export default router;