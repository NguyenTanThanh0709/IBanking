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
    const { email, money, description } = req.body;
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
            text: "THÔNG BÁO THANH TOÁN HỌC PHÍ. VỚI SỐ TIỀN: " + money  + "TRẠNG THÁI : "+  description,
            html: `<div><b>Thanh toán học phí</b></div> <div>message: ${description}</div> với số tiền : ${money} VNĐ`,
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
    const otp = OTP.generate(6, {
        digits: true,
        lowerCaseAlphabets: true,
        upperCaseAlphabets: false,
        specialChars: false ,
    })
    const salt = await bcrypt.genSalt(10);
    const hhOtp = await bcrypt.hash(otp, salt);
let generatedOtp = '';
for (let i = 0; i < 6; i++) {
    const charIndex = Math.floor(Math.random() * hhOtp.length);
    const charAscii = hhOtp.charCodeAt(charIndex); // Lấy mã ASCII của ký tự
    const num = parseInt(charAscii); // Chuyển mã ASCII thành số
    generatedOtp += num.toString().charAt(0); // Lấy chữ số đầu tiên của số
}
    

    console.log(generatedOtp)
    const  hashOtp = generatedOtp
    const OTPMODEL = new OtpModel({email,hashOtp});
    const otpresult = await OTPMODEL.save();
    await sendEmailCreateOrder(email,hashOtp)
    if(otpresult){
        res.json(otpresult);
    }else{
        res.status(500).json({message:"Error"})
    }
}

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