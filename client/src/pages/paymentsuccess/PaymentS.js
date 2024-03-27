import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from "socket.io-client";
import API from '../../api/API';
function PaymentS() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);


    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus');

    const mssv = searchParams.get('vnp_OrderInfo').split("_")[1];
    const idUser = searchParams.get('vnp_OrderInfo').split("_")[2];
    const idTuition = searchParams.get('vnp_OrderInfo').split("_")[3];
    const email = searchParams.get('vnp_OrderInfo').split("_")[4];

    const mssv1 = searchParams.get('vnp_OrderInfo').split("_")[5];
    const idsender = searchParams.get('vnp_OrderInfo').split("_")[6];

    const start = searchParams.get('vnp_OrderInfo').split("_")[7];
    const end = searchParams.get('vnp_OrderInfo').split("_")[8];




    const money = searchParams.get('vnp_Amount') / 100;

    console.log(mssv)


    const [showSuccessIcon, setShowSuccessIcon] = useState(false);
    const [showFailedIcon, setShowFailedIcon] = useState(false);


    useEffect(() => {
      // Kiểm tra vnp_ResponseCode và vnp_TransactionStatus để quyết định hiển thị biểu tượng tương ứng
      if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
          setShowSuccessIcon(true);
          setShowFailedIcon(false);
      } else {
          setShowSuccessIcon(false);
          setShowFailedIcon(true);
      }
  }, [vnp_ResponseCode, vnp_TransactionStatus]);


    const [socket, setSocket] = useState(null)
    useEffect(() => {
      setSocket(io("ws://localhost:8900"));
    }, []);

    const handleClickremoveUser = () =>{
      socket.emit("removeUser", mssv);
      socket.emit("removeUser", mssv1);
      socket.on("removeUsers", (users) => {
        console.log(users)
      });
    }

  const handleGoBack = () => {
    // Hàm xử lý khi nút "GO BACK" được nhấp
    if(vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
      // xử lý data base thanh toán thành công ngày giờ
      updateTution();
      let mailSuccess = {
        mssv: mssv,
        start: start,
        end: end,
        money: money,
        result: "THÀNH CÔNG",
        email: email,
      }
      sendEmailCreateOrderSuccess(mailSuccess);
    }else{
      let mailSuccess = {
        mssv: mssv,
        start: start,
        end: end,
        money: money,
        result: "THẤT BẠI",
        email: email,
      }
      sendEmailCreateOrderSuccess(mailSuccess);
      
    }
    handleClickremoveUser();
    navigate('/tuition'); // Điều hướng người dùng quay lại trang chủ ('/')
  };

  const updateTution = async () => {
    try {
      let data = {
        userId: idUser,
        userIdsender: idsender,
        status1: true,
        method: "CC"
      };
  
      // Thực hiện gọi API hoặc các xử lý khác tại đây để cập nhật học phí
      const response = await API.fetchUpdateHistoryTransactionByTuition(idTuition,data);
      
      console.log("Data updated successfully:", data);
    } catch (error) {
      console.error("Error occurred while updating tuition:", error);
    }
  };
  

  

  const sendEmailCreateOrderSuccess = async (body) => {
    try {
      const response = await API.fetchEmailSuccess(body);
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-gray-100">
      <div className="bg-white p-6 md:mx-auto">
      {showSuccessIcon && (
                    <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                        <path fill="currentColor" d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"></path>
                    </svg>
                )}
                {showFailedIcon && (
                    <svg className="text-green-600 w-16 h-16 mx-auto my-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" fill="red">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-18a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm4.293 10.293a1 1 0 0 1-1.414 1.414L12 13.414l-2.879 2.879a1 1 0 0 1-1.414-1.414L10.586 12 7.707 9.121a1 1 0 0 1 1.414-1.414L12 10.586l2.879-2.879a1 1 0 0 1 1.414 1.414L13.414 12l2.879 2.879z"/>
                    </svg>
                )}

        <div className="text-center">
        {showSuccessIcon && (
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Thanh toán học phí thành công</h3>
                    )}
                    {showFailedIcon && (
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Thanh toán học phí không thành công</h3>
                    )}
          <p className="text-gray-600 my-2">Vui lòng kiểm tra lại lịch sử thanh toán! chúc bạn ngày tốt lành!</p>
          <p>Have a great day!</p>
          <div className="py-10 text-center">
            <butotn   className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3" onClick={handleGoBack}>
              GO BACK
            </butotn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentS;
