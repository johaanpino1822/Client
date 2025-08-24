import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import { useCart } from '../../context/CartContext';

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: 'card'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        ...formData
      };
      
      const { order, paymentUrl } = await orderService.createOrder(orderData, token);
      
      // Redirigir a Wompi
      window.location.href = paymentUrl;
      
      // Opcional: Limpiar carrito si el pago es exitoso
      // Esto debería hacerse después de confirmar el pago realmente
      clearCart();
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar tu pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Información de Envío</h2>
      <textarea
        name="shippingAddress"
        value={formData.shippingAddress}
        onChange={handleChange}
        required
        placeholder="Dirección de envío completa"
      />
      
      <h2>Información de Facturación</h2>
      <textarea
        name="billingAddress"
        value={formData.billingAddress}
        onChange={handleChange}
        required
        placeholder="Dirección de facturación completa"
      />
      
      <h2>Método de Pago</h2>
      <select 
        name="paymentMethod" 
        value={formData.paymentMethod}
        onChange={handleChange}
        required
      >
        <option value="card">Tarjeta de Crédito/Débito</option>
        <option value="nequi">Nequi</option>
        <option value="pse">PSE</option>
      </select>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
      </button>
    </form>
  );
};

export default CheckoutForm;