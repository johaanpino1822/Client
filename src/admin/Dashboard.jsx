import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FiBox, 
  FiShoppingCart, 
  FiUsers, 
  FiDollarSign, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';
import { m as motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Usando las rutas exactas que tienes definidas
        const [statsRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats', config),
          axios.get('http://localhost:5000/api/admin/orders', config)
        ]);

        // Ajuste para la estructura de respuesta de tus rutas
        setStats({
          products: statsRes.data.data?.products || 0,
          orders: statsRes.data.data?.orders || 0,
          users: statsRes.data.data?.users || 0,
          revenue: statsRes.data.data?.revenue || 0
        });

        // Ajuste para la estructura de órdenes
        const ordersData = ordersRes.data.data || [];
        const sanitizedOrders = ordersData.map(order => ({
          _id: order._id || '',
          user: {
            name: order.user?.name || 'Cliente no registrado',
            email: order.user?.email || ''
          },
          total: order.total || 0,
          status: order.status || 'pending',
          createdAt: order.createdAt || new Date().toISOString(),
          paymentMethod: order.paymentMethod || 'desconocido'
        }));

        setRecentOrders(sanitizedOrders);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(err.response?.data?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0C4B45]"></div>
          <p className="mt-4 text-[#0C4B45] font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" size={20} />
            <p className="font-bold">Error</p>
          </div>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle className="mr-1" /> },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock className="mr-1" /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <FiAlertCircle className="mr-1" /> }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentMethodBadge = (method) => {
    const methodConfig = {
      credit_card: { color: 'bg-blue-100 text-blue-800', text: 'Tarjeta' },
      paypal: { color: 'bg-yellow-100 text-yellow-800', text: 'PayPal' },
      cash: { color: 'bg-green-100 text-green-800', text: 'Efectivo' },
      transfer: { color: 'bg-purple-100 text-purple-800', text: 'Transferencia' }
    };
    
    const config = methodConfig[method] || { color: 'bg-gray-100 text-gray-800', text: 'Otro' };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-[#0C4B45] mb-8">Panel de Control</h1>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Productos" 
          value={stats.products} 
          icon={<FiBox className="text-[#662D8F]" size={24} />}
          color="from-[#F2A9FD] to-[#e895fc]"
        />
        <StatCard 
          title="Órdenes" 
          value={stats.orders} 
          icon={<FiShoppingCart className="text-[#0C4B45]" size={24} />}
          color="from-[#83F4E9] to-[#6adfd4]"
        />
        <StatCard 
          title="Usuarios" 
          value={stats.users} 
          icon={<FiUsers className="text-[#512577]" size={24} />}
          color="from-[#662D8F] to-[#512577]"
        />
        <StatCard 
          title="Ingresos" 
          value={formatCurrency(stats.revenue)} 
          icon={<FiDollarSign className="text-[#083D38]" size={24} />}
          color="from-[#0C4B45] to-[#083D38]"
        />
      </div>

      {/* Órdenes recientes */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#0C4B45] flex items-center">
            <FiShoppingCart className="mr-2" />
            Órdenes Recientes
          </h2>
          <Link 
            to="/admin/orders" 
            className="text-sm font-medium text-[#662D8F] hover:text-[#512577] transition-colors"
          >
            Ver todas →
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No hay órdenes recientes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#662D8F] uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#662D8F] uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#662D8F] uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#662D8F] uppercase tracking-wider">Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#662D8F] uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#662D8F] uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0C4B45]">
                      #{order._id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                      <div className="text-sm text-gray-500">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0C4B45]">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentMethodBadge(order.paymentMethod)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Componente de tarjeta de estadística
const StatCard = ({ title, value, icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-md overflow-hidden"
  >
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-[#0C4B45]">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  </motion.div>
);

export default Dashboard;