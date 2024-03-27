import axiosClient  from './axiosClient';
const BASE_URL = 'http://localhost:5001';
const API = {
    fetchTuitionWithToken : (id) => {
        const url = `${BASE_URL}/api/tuition/${id}`;
        return axiosClient.get(url);
    },
    fetchVNPayWithToken : (body) => {
        
        const url = `${BASE_URL}/api/orders/create_payment_url`;
        return axiosClient.post(url,body);
    },
    fetchOtpWithToken : (body) => {
        const url = `${BASE_URL}/api/otp/send`;
        return axiosClient.post(url,body);
    },
    fetchCheckOtpWithToken : (body) => {
        const url = `http://localhost:5001/api/otp/get`;
        return axiosClient.post(url,body);
    },
    fetchUpdateStatus : (id,body) => {
        const url = `http://localhost:5001/api/tuition/${id}/update-status`;
        return axiosClient.post(url,body);
    },

    fetchGetHistoryTransactionByUser : (id) => {
        const url = `http://localhost:5001/api/history/user/${id}`;
        return axiosClient.get(url);
    },
    fetchUpdateHistoryTransactionByTuition : (id,body) => {
        const url = `http://localhost:5001/api/history/${id}`;
        return axiosClient.put(url,body);
    }
    ,   fetchEmailSuccess : (body) => {
        const url = `http://localhost:5001/api/otp/getsuccess`;
        return axiosClient.post(url,body);
    },fecthCreateHistoryPayment : (body) => {
        const url = `http://localhost:5001/api/history`;
        return axiosClient.post(url,body);
    }
}

export default API;