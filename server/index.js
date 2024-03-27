import express from 'express';
import bodyParser from 'body-parser';
import connect from './database/database.js'
import checkToken from './authentication/auth.js'
import order from './routers/order.js'
import login from './routers/login.js'
import tuition from './routers/tuition.js'
import otp from './routers/otp.js'
import history from './routers/history.js'
import dotenv from 'dotenv';
import cors from 'cors';

import { Server } from 'socket.io';
import { createServer } from 'http';
import paypal from 'paypal-rest-sdk' 

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AbNkSMoLhh9Y0eCaTJgGFR6ObFO2y46U9fO__pca8IbZO0os0s6WdLyJNNQFQ2oFizmXLe35-JEyhMNa',
    'client_secret': 'EB-C-zIDC9Xnc7yQlp2hLREMYNMG-BZSHhoPqonRFvHJ2gfXy_uzfkej_a7XdV0WmofDTaWBUlD3LlCH'
});


dotenv.config();
const app = express();
app.use(checkToken)
app.use(express.json())
app.use(cors({ origin: '*' }));
const port = process.env.PORT || 5000


app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(bodyParser.json({limit:'30mb'}));
app.use(bodyParser.urlencoded({limit:'30mb', extended:true}));


app.use('/login', login);
app.use('/api/otp', otp);
app.use('/api/tuition', tuition);
app.use('/api/orders', order);
app.use('/api/history', history);


app.post('/pay', (req, res) => {
    const data = req.body;
    // console.log('Received data:', data);    
    const money = (data.amount / 23000).toFixed(2).toString();
    // // orderId + "_" + mssv + "_" + _id + "_" + mssv1 + "_" + email + "_" + idTuition + "_" + idUser;
    const vnp_OrderInfo = 'hihi'+ "_" + data.mssv + "_" + data.idUser + "_" + data.idTuition + "_" + data.email + "_" + data.mssv1 + "_"+ data.idsender + "_" + data.start + "_" + data.end;
    // console.log(money);
    console.log(req.body);  
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:5001/success?money=" + money+"&vnp_OrderInfo=" + vnp_OrderInfo,
            "cancel_url": "http://localhost:3000/payment/result?vnp_ResponseCode=01&vnp_TransactionStatus=01&vnp_OrderInfo=" + vnp_OrderInfo
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Học phí",
                    "sku": "001",
                    "price": money,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": money
            },
            "description": "Thanh toán học phí từ " + data.mssv1 + " đến " + data.mssv + " từ " + data.start + " đến " + data.end
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    return res.json({link : payment.links[i].href})
                }
            }

        }
    });


});


app.get('/success', (req, res) => {

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const money = req.query.money;
    const vnp_OrderInfo = req.query.vnp_OrderInfo;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": money
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.redirect("http://localhost:3000/payment/result?vnp_ResponseCode=00&vnp_TransactionStatus=00&vnp_OrderInfo=" + vnp_OrderInfo);
        }
    });
});



app.listen(port, async() => {
    await connect()
    console.log(`listening on portt : ${port}`)
})
