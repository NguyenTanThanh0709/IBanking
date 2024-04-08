import OtpModel from "../models/OtpModel.js"
import OTP from "otp-generator"
import bcrypt from "bcrypt"
import dotenv from 'dotenv';
import nodemailer  from 'nodemailer';
import inlineBase64  from 'nodemailer-plugin-inline-base64'


const sendEmailCreateOrder = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'gmail', 
        port: 587,
        secure: false, // Set to false for STARTTLS
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });
    transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT,
        to: email,
        subject: "MÃ OTP THANH TOÁN CỦA BẠN", 
        text: "Mã OTP: " + otp,
        html: `<div><b>Lấy mã và thanh toán</b></div> <div>Mã OTP: ${otp}</div>`,
    });
}


const sendEmailCreateOrderSuccess = async (req, res) => {
    const { mssv,start,end,money,result,email } = req.body;
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'gmail', 
        port: 587,
        secure: false, // Set to false for STARTTLS
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });
    transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

    try {
        let info = await transporter.sendMail({
            from: process.env.MAIL_ACCOUNT,
            to: email,
            subject: "THÔNG BÁO THANH TOÁN HỌC PHÍ", 
            html: `
                <div>
                Gửi kết quả thanh toán học phí của sinh viên với MSSV: ${mssv}.
                </div>
                <div>
                Kết Quả Thanh toán Học phí học kỳ  ${start}-${end} với học phí ${money} VNĐ.
                </div>
                <div>
                Kết Quả: ${result}.
                </div>
                <div>
                kính chúc bạn có một ngày tốt lành.
                </div>

            `,
        });
        console.log("Email sent: " + info.response);
        res.send(true); // Gửi true nếu gửi email thành công
    } catch (error) {
        console.error("Email sending error:", error);
        res.send(false); // Gửi false nếu gửi email không thành công
    }
}



const OTPSend = async (req, res) => {
    const { email } = req.body;

    let otp;
    let hashOtp;

    // Loop until a unique OTP is generated
    do {
        otp = OTP.generate(6, {
            digits: true,
            lowerCaseAlphabets: true,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        hashOtp = '';
        for (let i = 0; i < 6; i++) {
            const charIndex = Math.floor(Math.random() * hashedOtp.length);
            const charAscii = hashedOtp.charCodeAt(charIndex);
            const num = parseInt(charAscii);
            hashOtp += num.toString().charAt(0);
        }

        // Check if the generated OTP already exists in the database
        const existingOTP = await OtpModel.findOne({ email, hashOtp });
        if (existingOTP) {
            // If OTP exists, continue the loop to generate a new one
            continue;
        }

        // If OTP doesn't exist, break the loop
        break;
    } while (true);

    console.log(hashOtp);

    // Save the OTP to the database
    const OTPMODEL = new OtpModel({ email, hashOtp });
    const otpResult = await OTPMODEL.save();

    // Send the OTP via email
    await sendEmailCreateOrder(email, hashOtp);

    if (otpResult) {
        res.json(otpResult);
    } else {
        res.status(500).json({ message: "Error" });
    }
};


const getOtpModelByOtp = async (req, res) => {
    try {
        // Lấy mã OTP từ request
        const { hashOtp } = req.body;
        console.log(hashOtp)
        
        // Tìm kiếm document trong OtpModel dựa trên mã OTP đã được băm
        const otpDocument = await OtpModel.findOne({ hashOtp: hashOtp });

        if (!otpDocument) {
            // Nếu không tìm thấy mã OTP tương ứng
            return res.status(404).json({ message: "OTP not found" });
        }
        res.status(200).json(otpDocument);
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error retrieving OTP document:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {
    OTPSend,
    getOtpModelByOtp,
    sendEmailCreateOrderSuccess
};