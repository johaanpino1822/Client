import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">¡Gracias por tu pedido!</h1>
      <p className="text-gray-700 mb-6">Tu número de orden es <span className="font-semibold">{orderId}</span>.</p>
      <Link to="/" className="text-blue-600 hover:underline">Volver al inicio</Link>
    </div>
  );
};

export default OrderSuccess;
