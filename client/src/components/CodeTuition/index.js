import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from "react-paypal-button-v2";
import {fetchUserWithToken} from '../../api'
import API from '../../api/API'
import { io } from "socket.io-client";
import OtpInput from '../Card/OtpInput'

export default function CodeTuitionItem(props) {
  const loginState = useSelector(state => state.login);
  const data = props.data;
  const tuitionDataExists = data && data.length > 0;



  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [sdt, setSdt] = useState('');

  const [socket, setSocket] = useState(null)
  useEffect(() => {
    setSocket(io("ws://localhost:8900"));
  }, []);

  const handleClickaddUser = () =>{
    socket.emit("addUser", data[0].user.mssv);
    socket.emit("addUser", loginState.data.mssv);
    socket.on("getUsers", (users) => {
      console.log(users)
    });
  }
  

  const checkUser = (userId) => {
    return new Promise((resolve, reject) => {
        socket.emit("checkUser", userId);
        socket.on("userExists", (userExists) => {
            resolve(userExists);
        });
    });
};


  useEffect(() => {
    if (loginState.data) {
        setEmail(loginState.data.email);
        setUsername(loginState.data.name);
        setSdt(loginState.data.phoneNumber);
    }
}, [])


  
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showOtpInput_, setShowOtpInput_] = useState(false);
  const [loading, setLoading] = useState(false);

  const openOTP = async () => {
   
    let data_ = { email: data[0].user.email }
    console.log(  data_)
    try {
      let data1 = await API.fetchOtpWithToken(data_);
      console.log(data1)
    if(data1){
      alert("Mã OTP đã được gửi đến email của bạn")
      setShowOtpInput(true);
      startCountdown();
    }else{
      alert("Mã OTP không thể gửi đến email của bạn")
    }
    } catch (error) {
      alert("Mã OTP không thể gửi đến email của bạn")
      
    }   
  }

  const openOTP_ = async () => {
   
    let data_ = { email: data[0].user.email }
    console.log(  data_)
    try {
      let data1 = await API.fetchOtpWithToken(data_);
      console.log(data1)
    if(data1){
      alert("Mã OTP đã được gửi đến email của bạn")
      setShowOtpInput_(true);
      startCountdown();
    }else{
      alert("Mã OTP không thể gửi đến email của bạn")
    }
    } catch (error) {
      alert("Mã OTP không thể gửi đến email của bạn")
      
    }   
  }

  const offOTP = () => {
    setShowOtpInput(false);
  }
  const offOTP_ = () => {
    setShowOtpInput_(false);
  }
  const onOtpSubmit = async (otp) => {
    let data = { hashOtp: otp }
    console.log("Login Successful", data);

    try {
      let data1 = await API.fetchCheckOtpWithToken(data);
      // console.log(data1)
    if(data1){
      alert("Tiến Hành Thanh Toán")
      // setShowOtpInput(true);
      if(showOtpInput){
        handlePayment();
      }else if(showOtpInput_){
        PayPak();
      }
    }else{
      alert("OTP LỖI")
    }
    } catch (error) {
      alert("OTP LỖI")
      
    }
    
};

const [seconds, setSeconds] = useState(60);
const [isRunning, setIsRunning] = useState(false);
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prevSeconds => prevSeconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [seconds, isRunning]);
  const startCountdown = () => {
    setSeconds(60);
    setIsRunning(true);
  };


  const handlePayment = async () => { 

    const userExists = await checkUser(data[0].user.mssv);
    const userExists_ = await checkUser(loginState.data.mssv);

    if(!userExists && !userExists_){
      handleClickaddUser();
      try {

        const token = loginState.data.token;
          const response = await fetch('http://localhost:5001/api/orders/create_payment_url', {
              method: 'POST',
              body: JSON.stringify({ 
                amount: data[0].fee, 
                bankCode: 'VNBANK', 
                language: 'vn',

                idUser: data[0].user._id,  // id của người học phí
                idTuition: data[0]._id,    // mã học phí
                email: data[0].user.email, // email của người học phí
                mssv: data[0].user.mssv,  // mssv của người học phí

                idsender: loginState.data._id, 
                mss1: loginState.data.mssv // người thực hiện thanh toán 

                ,start : data[0].start
                ,end : data[0].end,

            }),
            
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          });
          
          // Check if the response is successful
          if (response.ok) {
              // If successful, parse the response JSON
              const responseData = await response.json();
              // console.log(responseData);
              
              // Check if the responseData contains the redirection URL
              if (responseData) {
                  // Redirect the user to the payment page
                  window.location.href = responseData;
              } else {
                  console.error('Redirection URL not found in response data');
              }
          } else {
              console.error('Failed to fetch redirection URL');
          }
      } catch (error) {
          console.error('Error handling payment:', error);
      }
    }else{
      alert("SINH VIÊN NÀY ĐANG TRONG QUÁ TRÌNH THANH TOÁN, VUI LÒNG QUAY LẠI SAU!")
    }


    
  };

  const [sdkReady, setSdkReady] = useState(false);
  useEffect(() => {
    if(!window.paypal) {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AWxQqBifkgLxU7HVb34_9Z3q3_5nJbYiM_jmubqututeWjDMd_ZJIU2n4wpJF-ZM4WVD60ky2giVehzn';
      script.async = true
      script.onload=()=>{
        setSdkReady(true);
      } 
      document.body.appendChild(script);
    }else{
      setSdkReady(true);
    }

  }, [])

  const PayPak = async() => {
    const datapaypal = { 
                amount: data[0].fee, 
                bankCode: 'VNBANK', 
                language: 'vn',

                idUser: data[0].user._id,  // id của người học phí
                idTuition: data[0]._id,    // mã học phí
                email: data[0].user.email, // email của người học phí
                mssv: data[0].user.mssv,  // mssv của người học phí

                idsender: loginState.data._id, 
                mss1: loginState.data.mssv // người thực hiện thanh toán 

                ,start : data[0].start
                ,end : data[0].end,
    }
    // console.log(datapaypal)
    const token = localStorage.getItem('token');

    const userExists = await checkUser(data[0].user.mssv);
    const userExists_ = await checkUser(loginState.data.mssv);

    if(!userExists && !userExists_){
      handleClickaddUser();

    try {
      const response = await fetch('http://localhost:5001/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the headers
            },
            body: JSON.stringify(datapaypal)
        });

      if (response.ok) {
          const responseData = await response.json();
          console.log(responseData.link); // Handle the response data as needed
          window.location.href = responseData.link;
      } else {
          console.error('Failed to fetch data');
      }
  } catch (error) {
      console.error('Error while fetching data:', error);
  }
    }

  }

  return (
    <Container fluid={true}>
        <Row>
            <Col>
                <p className= "fw-bold text-rose-600 fs-4">Thông tin người nộp tiền:</p>
                <div className="border rounded-lg shadow-md p-4">


                <label htmlFor="website-admin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Họ Và Tên
                </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="website-admin"
                      value={username}
                      disabled= {true}
                      className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="elonmusk"
                    />
                  </div>

                  <label htmlFor="input-group-1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 16"
                      >
                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="input-group-1"
                      value={email}
                      disabled= {true}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@flowbite.com"
                    />
                  </div>


                  <label htmlFor="input-group-1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Số Điện Thoại
                  </label>
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15 1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM8 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm4-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                      />
                    </svg>

                    </div>
                    <input
                      type="text"
                      id="input-group-1"
                      disabled= {true}
                      value={sdt}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@flowbite.com"
                    />
                  </div>
                  
                </div>
            </Col>


            {tuitionDataExists && 1===1 ? (


            <Col>
                <p className= "fw-bold text-rose-600 fs-4">Thông tin học phí:</p>

                <div className="border rounded-lg shadow-md p-4">
                <label htmlFor="website-admin1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Họ Và Tên
                </label>
                <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"

                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="website-admin1"
                      value={data[0].user.name}
                      disabled= {true}
                      className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>


                <label htmlFor="website-admin11" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Mã Số Sinh Viên
                </label>
                <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="website-admin11"
                      value={data[0].user.mssv}
                      disabled= {true}
                      className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>


                <label htmlFor="website-admin12" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Số Tiền Cần Nộp (VNĐ)
                </label>
                <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0ZM11 15v1a2 2 0 0 1-4 0v-1H6a2 2 0 0 1-2-2v-2h2V9a3 3 0 0 1 6 0v2h2v2a2 2 0 0 1-2 2h-1ZM7 9a1 1 0 0 0-2 0v2h2V9Zm6 0a1 1 0 0 0-2 0v2h2V9Z"/>
                    </svg>
                    </span>
                    <input
                      type="text"
                      id="website-admin12"
                      value={data[0].fee.toLocaleString('en-US')}
                      disabled= {true}
                      className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                {/* <Button variant="danger" className='mt-2' onClick={() => handlePayment()}>Thanh Toán VNPAY</Button> */}


                {
                  data[0].status ? (
                    <></>
                  ) : (<>
                  
                  
                  
                  
                  
                

                {!loading ? (
                  <div></div>
            ) : (
                {/* <div>...Loading</div> */}

            )}



                {!showOtpInput ? (
                  <Button variant="danger" className='mt-2' onClick={() => openOTP()}>Thanh Toán VNPAY</Button>
            ) : (
                <div>
                    <p>Enter OTP sent to {email}</p>
                    <h1>{seconds} seconds left</h1>
                    <OtpInput length={6}
                        onOtpSubmit={onOtpSubmit} />
                    {/* <Button variant="danger" className='mt-2 mx-2' onClick={() => handlePayment()}>Thanh Toán</Button> */}
                    <Button variant="success" className='mt-2' onClick={() => offOTP()}>Quay Lại</Button>
                </div>
            )}
                <div>OR</div>
                {!showOtpInput_ ? (<><Button variant="danger" className='mt-2' onClick={() => openOTP_()}>Thanh Toán PayPal</Button></>) :
                
                (

                  <div>
                    <p>Enter OTP sent to {email}</p>
                    <h1>{seconds} seconds left</h1>
                    <OtpInput length={6}
                        onOtpSubmit={onOtpSubmit} />
                    {/* <Button variant="danger" className='mt-2 mx-2' onClick={() => handlePayment()}>Thanh Toán</Button> */}
                    <Button variant="success" className='mt-2' onClick={() => offOTP_()}>Quay Lại</Button>
                </div>
                )
                  // <Button variant="danger" className='mt-2' onClick={() => PayPak()}>Thanh Toán PayPal</Button>
                

                 
                }
                  </>)
                }
                </div>
            </Col>
) : (

    <Col>Không có dữ liệu học phí</Col>
)}

        </Row>
    </Container>
  )
}
