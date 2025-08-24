import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para manejar las URLs de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/80';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/products/${imagePath}`;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No hay sesión activa');
        }

        const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.data || !response.data.data) {
          throw new Error('Estructura de respuesta inválida');
        }

        const orderData = response.data.data;
        
        const normalizedOrder = {
          ...orderData,
          items: Array.isArray(orderData.items) 
            ? orderData.items.map(item => ({
                ...item,
                product: item.product || {},
                _id: item._id || item.product?._id || Math.random().toString(36).substr(2, 9),
                name: item.name || item.product?.name || 'Producto sin nombre',
                price: item.price || item.product?.price || 0,
                quantity: item.quantity || 1,
                image: getImageUrl(item.image || item.product?.image || '') // Usamos getImageUrl aquí
              }))
            : [],
          shippingAddress: orderData.shippingAddress || orderData.shippingInfo || {},
          paymentStatus: orderData.paymentStatus || 'pending',
          paymentMethod: orderData.paymentMethod || 'No especificado',
          itemsPrice: orderData.itemsPrice || orderData.subtotal || 0,
          shippingPrice: orderData.shippingPrice || orderData.shipping || 0,
          totalPrice: orderData.totalPrice || orderData.total || 0
        };

        setOrder(normalizedOrder);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.error || err.message || 'No se pudo cargar la orden');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ArrowPathIcon className="animate-spin h-12 w-12 text-blue-500" />
        <span className="ml-2 text-lg">Cargando detalles del pedido...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-start mx-auto max-w-2xl mt-8">
        <ExclamationTriangleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-red-600 hover:text-red-800 underline mt-2"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8 text-gray-600">
        No se encontró información de la orden
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-14 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Encabezado con estado de pago */}
        <div className={`p-6 ${order.paymentStatus === 'completed' ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <div className="flex items-center justify-center mb-4">
            {order.paymentStatus === 'completed' ? (
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
            ) : (
              <XCircleIcon className="h-12 w-12 text-yellow-500" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">
            {order.paymentStatus === 'completed' 
              ? '¡Gracias por tu compra!' 
              : 'Pago pendiente'}
          </h1>
          
          <p className="text-center mb-6">
            {order.paymentStatus === 'completed'
              ? `Tu pedido #${order.orderNumber || order._id?.slice(-6).toUpperCase() || ''} ha sido confirmado.`
              : `Tu pedido #${order.orderNumber || order._id?.slice(-6).toUpperCase() || ''} está pendiente de pago.`}
          </p>
        </div>

        {/* Resumen de productos */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
          
          <div className="space-y-4 mb-6">
            {order.items.length > 0 ? (
              order.items.map(item => (
                <div key={item._id} className="flex justify-between items-start border-b pb-4">
                  <div className="flex items-center">
                    <img 
                      src={getImageUrl(item.image)} // Usamos getImageUrl aquí
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80';
                        e.target.onerror = null;
                      }}
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity}
                        {item.product?.size && ` • Talla: ${item.product.size}`}
                        {item.product?.color && ` • Color: ${item.product.color}`}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium whitespace-nowrap">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay productos en este pedido</p>
            )}
          </div>

          {/* Totales */}
          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold mb-2">
              <span>Subtotal:</span>
              <span>${order.itemsPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Envío:</span>
              <span>${order.shippingPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
              <span>Total:</span>
              <span>${order.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-4">
              <span>Método de pago:</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Estado:</span>
              <span className="capitalize">
                {order.paymentStatus === 'completed' ? 'Pagado' : 
                 order.paymentStatus === 'pending' ? 'Pendiente' : 
                 order.paymentStatus || 'Desconocido'}
              </span>
            </div>
          </div>
        </div>

        {/* Dirección de envío */}
        <div className="p-6 bg-gray-50 border-t">
          <h2 className="text-lg font-semibold mb-2">Dirección de Envío</h2>
          {order.shippingAddress ? (
            <>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}{order.shippingAddress.state && `, ${order.shippingAddress.state}`}</p>
              <p>Teléfono: {order.shippingAddress.phone}</p>
              {order.shippingAddress.email && <p>Email: {order.shippingAddress.email}</p>}
              {order.shippingAddress.additionalInfo && (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Instrucciones adicionales:</span> {order.shippingAddress.additionalInfo}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500">No se proporcionó dirección de envío</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;