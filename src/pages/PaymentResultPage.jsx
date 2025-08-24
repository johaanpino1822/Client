import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const PaymentResultPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar la orden');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-lg">Verificando estado de tu pago...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold mt-4">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const isSuccess = order.paymentStatus === 'paid';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`p-8 ${isSuccess ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <div className="flex justify-center">
            {isSuccess ? (
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            ) : (
              <XCircleIcon className="h-16 w-16 text-yellow-500" />
            )}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold">
              {isSuccess ? '¡Pago Exitoso!' : 'Pago Pendiente'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSuccess 
                ? `Tu orden #${order.orderNumber} ha sido confirmada.` 
                : `Tu orden #${order.orderNumber} está pendiente de pago.`}
            </p>
          </div>
        </div>

        <div className="p-8 border-t border-gray-200">
          <h3 className="text-lg font-medium">Resumen del Pedido</h3>
          
          <div className="mt-4 space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                </div>
                <span className="font-medium">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => navigate(isSuccess ? '/' : '/cart')}
            className={`w-full py-2 px-4 rounded-md font-medium text-white ${
              isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSuccess ? 'Volver al inicio' : 'Reintentar pago'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;