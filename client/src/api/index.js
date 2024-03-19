import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

// Function to handle login request
export const fetchLogin = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/login`, payload);
    return response;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
export const fetchUserWithToken = async (payload) => {
  const {user, token} = payload;
  try {
    const config = {
      headers: {
        // Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.get(`${BASE_URL}/login/${user}`);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
export const fetchUserMSSVWithToken = async (payload) => {
  const {mssv, token} = payload;
  try {
    const config = {
      headers: {
        // Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.get(`${BASE_URL}/login/mssv/${mssv}`);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

