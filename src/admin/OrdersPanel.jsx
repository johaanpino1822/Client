import React, { useEffect, useState } from 'react';
import orderService from '../../services/orderService';

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getOrders(token);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [token]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Implementar llamada API para actualizar estado
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) return <div>Cargando órdenes...</div>;

  return (
    <div>
      <h1>Panel de Órdenes</h1>
      <table>
        <thead>
          <tr>
            <th>N° Orden</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Pago</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.orderNumber}</td>
              <td>{order.user?.name || 'Anónimo'}</td>
              <td>${order.totalAmount.toFixed(2)}</td>
              <td>
                <select 
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="processing">Procesando</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </td>
              <td>{order.paymentStatus}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => navigate(`/admin/orders/${order._id}`)}>
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPanel;