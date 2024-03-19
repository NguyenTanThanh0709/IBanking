import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';

import {
    createPayment,
    returnPayment,
} from '../controllers/payment.js';

router.post('/create_payment_url', createPayment);
router.get('/vnpay_return', returnPayment);


router.get('/config', (req, res) => {
    return res.status(200).json({
        status:'OK'
        ,data:'AWxQqBifkgLxU7HVb34_9Z3q3_5nJbYiM_jmubqututeWjDMd_ZJIU2n4wpJF-ZM4WVD60ky2giVehzn'
    })
})

export default router;
