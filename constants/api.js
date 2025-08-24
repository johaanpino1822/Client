// src/constants/api.js
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:5001/vasquezpc1/us-central1/api'
    : 'https://us-central1-vasquezpc1.cloudfunctions.net/api'
};