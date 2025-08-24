import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders'); // asegúrate que esta ruta esté protegida para admin
      setOrders(response.data);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-5">Cargando órdenes...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Órdenes</h2>
      {orders.length === 0 ? (
        <p>No hay órdenes registradas.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg">Orden ID: {order._id}</h3>
              <p><strong>Cliente:</strong> {order.user?.name} ({order.user?.email})</p>
              <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Total:</strong> ${order.total?.toFixed(2)}</p>
              <div className="mt-2">
                <h4 className="font-semibold">Productos:</h4>
                <ul className="list-disc list-inside">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.product?.name} - Cantidad: {item.quantity} - Precio: ${item.product?.price}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
