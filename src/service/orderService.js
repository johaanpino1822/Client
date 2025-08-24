import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/orders`, orderData, config);
  return response.data;
};

const getOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/orders`, config);
  return response.data;
};

export default {
  createOrder,
  getOrders,
};