import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon,
  
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no disponible. Debes iniciar sesión.');

      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedOrders = Array.isArray(response.data.data) ? response.data.data : [];
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Error al obtener las órdenes:', err);
      setError(err.response?.data?.error || 'No se pudieron cargar las órdenes. Verifica tu sesión o permisos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 mr-1" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 mr-1" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 mr-1" />;
      case 'processing':
        return <ArrowPathIcon className="h-5 w-5 mr-1 animate-spin" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 mr-1" />;
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      setError('No se pudo actualizar el estado de la orden');
    }
  };

  if (loading) return (
    <motion.div 
      className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0C4B45]/10 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] mb-4"></div>
        <span className="text-[#0C4B45] font-medium">Cargando órdenes...</span>
      </motion.div>
    </motion.div>
  );

  if (error) return (
    <div className="text-center py-20 bg-gradient-to-b from-[#0C4B45]/10 to-white">
      <motion.div 
        className="inline-block bg-white p-6 rounded-xl shadow-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-xl font-bold text-[#662D8F] mb-2">Error al cargar órdenes</h3>
        <p className="text-[#0C4B45]">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-[#662D8F] text-white rounded-lg hover:bg-[#512577] transition-colors"
          onClick={fetchOrders}
          aria-label="Reintentar carga de órdenes"
        >
          Reintentar
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-b from-[#83F4E9]/10 to-white min-h-screen">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-[#0C4B45]">
          Administración de <span className="text-[#662D8F]">Órdenes</span>
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] mb-6"></div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Buscar órdenes por ID, nombre o email..."
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#83F4E9] focus:border-[#0C4B45] outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <label className="text-sm font-medium text-[#0C4B45]">Filtrar por estado:</label>
            <select
              className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#83F4E9] focus:border-[#0C4B45] outline-none transition"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="processing">En proceso</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>

        {/* Tabla de órdenes */}
        {filteredOrders.length === 0 ? (
          <motion.div 
            className="text-center py-12 bg-white rounded-xl shadow-sm max-w-md mx-auto"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <p className="text-[#0C4B45]/70 text-lg">No se encontraron órdenes</p>
            <button 
              className="mt-4 px-4 py-2 bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] text-white rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Limpiar filtros
            </button>
          </motion.div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#0C4B45]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Productos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <motion.tr 
                    key={order._id} 
                    className="hover:bg-gray-50"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.user?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.user?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#662D8F]">
                      ${order.total?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-[#0C4B45] hover:text-[#83F4E9]"
                          title="Ver detalles"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="text-xs border rounded p-1 focus:ring-[#83F4E9] focus:border-[#0C4B45]"
                          title="Cambiar estado"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="completed">Completado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Modal de detalles */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[#0C4B45]">
                  Detalles de la Orden #{selectedOrder._id.substring(0, 8)}...
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-[#662D8F] mb-2">Información del Cliente</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><span className="font-medium">Nombre:</span> {selectedOrder.user?.name || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.user?.email || 'N/A'}</p>
                    <p><span className="font-medium">Teléfono:</span> {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-[#662D8F] mb-2">Dirección de Envío</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.shippingAddress?.address || 'N/A'}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                    <p>{selectedOrder.shippingAddress?.postalCode}</p>
                  </div>
                </div>
              </div>

              <h4 className="font-medium text-[#662D8F] mb-2">Productos</h4>
              <div className="mb-6">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex items-center py-3 border-b last:border-b-0">
                    <img 
                      src={item.image || 'https://via.placeholder.com/80'} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                      {item.size && <p className="text-sm text-gray-600">Talla: {item.size}</p>}
                      {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                    </div>
                    <p className="font-medium text-[#662D8F]">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="font-medium text-[#662D8F]">Subtotal</p>
                  <p>${selectedOrder.itemsPrice?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-medium text-[#662D8F]">Envío</p>
                  <p>${selectedOrder.shippingPrice?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-medium text-[#662D8F]">Total</p>
                  <p className="font-bold text-lg">${selectedOrder.totalPrice?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;