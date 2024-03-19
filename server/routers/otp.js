import express from 'express';

import {
    OTPSend,
    getOtpModelByOtp,
    sendEmailCreateOrderSuccess
} from '../controllers/otp.js';
const router = express.Router();

router.post('/send', OTPSend);
router.post('/get', getOtpModelByOtp);
router.post('/getsuccess', sendEmailCreateOrderSuccess);

export default router;