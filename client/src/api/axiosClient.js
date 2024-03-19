import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
  paramsSerializer: params => queryString.stringify(params),
});

// Interceptor để thêm token từ cookies và header 'Content-Type: application/json' vào mỗi yêu cầu
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ cookies (điều này phụ thuộc vào cách bạn đã lưu trữ token trong cookies)
    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Thêm header 'Content-Type: application/json'
    }
    else {
      alert("Bạn chưa đăng nhập! sẽ chuyển hướng trang để đăng nhập!");

      // Nếu không có token, chuyển hướng đến trang đăng nhập (điều này phụ thuộc vào cách bạn quyết định đường dẫn trang đăng nhập)
      window.location.href = '/'; // Thay đổi đường dẫn tùy thuộc vào cấu trúc đường dẫn của ứng dụng bạn
      return Promise.reject('Chưa đăng nhập');
    }
    config.headers['Content-Type'] = 'application/json';


    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi
    throw error;
  }
);

export default axiosClient;