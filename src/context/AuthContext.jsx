import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
    } catch (err) {
      console.error('Error de autenticación:', err);
      localStorage.removeItem('token');
      setError(err.response?.data?.message || 'Tu sesión ha expirado');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/api/users/login', credentials);
      
      if (!response.data.user) {
        throw new Error('El servidor no devolvió datos de usuario');
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);

      return { user, token };
    } catch (err) {
      console.error('Error en login:', {
        response: err.response?.data,
        message: err.message
      });
      
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Error de autenticación';
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout,
      isAdmin: user?.role === 'admin' || user?.isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};