import React, { useState } from 'react';
import axios from 'axios';

const Checkout = ({ cartItems, clearCart }) => {
  const [shippingData, setShippingData] = useState({
    name: '',
    address: '',
    city: '',
    department: '',
    postalCode: '',
    phone: '',
    email: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      setErrorMessage('Tu carrito está vacío.');
      return;
    }

    if (!shippingData.email) {
      setErrorMessage('Por favor ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Debes iniciar sesión.');

      // 1. Crear la orden en tu backend
      const orderResponse = await axios.post('http://localhost:5000/api/orders', {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        shippingAddress: shippingData,
        paymentMethod,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 2. Crear transacción en Wompi
      const wompiResponse = await axios.post(
        'http://localhost:5000/api/wompi/create-transaction',
        {
          orderId: orderResponse.data._id,
          amount: total,
          customerEmail: shippingData.email,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 3. Redirigir a Wompi para completar el pago
      window.location.href = wompiResponse.data.paymentUrl;

    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setErrorMessage(error.response?.data?.message || 'Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Finalizar Pedido</h2>

      <div className="grid gap-4 mb-6">
        <h3 className="text-lg font-semibold">Información de Envío</h3>
        <input 
          name="name" 
          placeholder="Nombre completo" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required 
        />
        <input 
          name="email" 
          type="email"
          placeholder="Correo electrónico" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required 
        />
        <input 
          name="address" 
          placeholder="Dirección" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required 
        />
        <input 
          name="city" 
          placeholder="Ciudad" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required 
        />
        <input 
          name="department" 
          placeholder="Departamento" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required 
        />
        <input 
          name="postalCode" 
          placeholder="Código Postal" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required 
        />
        <input 
          name="phone" 
          placeholder="Teléfono" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required 
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Método de Pago</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="card">Tarjeta de Crédito/Débito</option>
          <option value="nequi">Nequi</option>
          <option value="pse">PSE</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Resumen del Pedido</h3>
        <ul className="text-sm text-gray-700 my-2">
          {cartItems.map(item => (
            <li key={item._id} className="flex justify-between py-1">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-2 font-bold flex justify-between">
          <span>Total:</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-100 text-green-700 rounded mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded font-medium disabled:bg-gray-400"
      >
        {loading ? 'Procesando pago...' : 'Pagar con Wompi'}
      </button>

      <div className="mt-4 text-xs text-gray-500">
        <p>Serás redirigido a Wompi para completar tu pago de forma segura.</p>
      </div>
    </div>
  );
};

export default Checkout;