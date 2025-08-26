// api/axios.js
import axios from 'axios';

// URL base para producción - usar el nuevo dominio del servidor
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://server-21pdm2e1h-jdpino3146396-gmailcoms-projects.vercel.app/';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔥 IMPORTANTE: Para cookies y autenticación
  timeout: 15000, // Aumentado a 15 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log('🔄 Haciendo request a:', config.url);
    
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response recibido:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error de API:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      code: error.code
    });

    // Manejo específico de errores
    if (error.response?.status === 401) {
      // Redirigir a login si no está autenticado
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Error de red - Verifica tu conexión');
    } else if (error.response?.status === 404) {
      console.error('🔍 Endpoint no encontrado');
    }

    return Promise.reject(error);
  }
);

export default api;