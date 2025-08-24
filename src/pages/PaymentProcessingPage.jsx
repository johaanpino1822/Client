import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PaymentProcessingPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    // Simular procesamiento de pago
    const timer = setTimeout(() => {
      clearCart();
      navigate('/payment/result?status=success');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Procesando tu pago</h2>
        <p className="text-gray-600">Estamos verificando tu transacción con Wompi...</p>
        <p className="text-sm text-gray-500 mt-4">Por favor no cierres esta página.</p>
      </div>
    </div>
  );
};

export default PaymentProcessingPage;