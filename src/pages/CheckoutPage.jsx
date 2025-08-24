import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    paymentMethod: 'card'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      // 1. Crear la orden en el backend
      const orderResponse = await axios.post('/api/orders', {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Iniciar pago con Wompi
      const paymentResponse = await axios.post('/api/wompi/create-transaction', {
        orderId: orderResponse.data._id,
        amount: total,
        customerEmail: formData.email,
        paymentMethod: formData.paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 3. Redirigir a página de procesamiento
      navigate('/payment/processing');
      
      // 4. Redirigir a Wompi (después de mostrar feedback al usuario)
      setTimeout(() => {
        window.location.href = paymentResponse.data.paymentUrl;
      }, 2000);

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulario de envío */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">Información de Envío</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Nombre completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Ciudad</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold pt-4">Método de Pago</h2>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="card">Tarjeta de Crédito/Débito</option>
              <option value="nequi">Nequi</option>
              <option value="pse">PSE</option>
            </select>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className={`w-full py-3 px-4 rounded font-medium text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {loading ? 'Procesando...' : 'Pagar $' + total.toLocaleString()}
            </button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Tu Pedido</h2>
          
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between border-b pb-2">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-gray-500">x {item.quantity}</p>
                </div>
                <p>${(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;