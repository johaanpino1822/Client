import React, { useState } from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaBars, 
  FaTimes, 
  FaSignOutAlt, 
  FaTachometerAlt, 
  FaBox, 
  FaShoppingBag, 
  FaUsers,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { FaSearch } from 'react-icons/fa';  // Importación específica

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Paleta de colores profesional
  const colors = {
    primary: '#0C4B45',
    primaryLight: '#83F4E9',
    primaryDark: '#083D38',
    secondary: '#662D8F',
    secondaryLight: '#F2A9FD',
    accent: '#4CAF50',
    textDark: '#0C4B45',
    textLight: '#E0F3EB',
    background: '#F0F9F5',
    sidebarBg: '#0C4B45',
    sidebarText: '#E0F3EB',
    sidebarHover: '#083D38'
  };

  if (!user || isAdmin !== true) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    toast.success(
      <div className="flex items-center">
        <FaSignOutAlt className="mr-2" />
        <span>Sesión cerrada correctamente</span>
      </div>,
      {
        position: "top-right",
        className: 'bg-white border-l-4 border-[#662D8F] shadow-lg'
      }
    );
    logout();
  };

  return (
    <div className="flex h-screen bg-[#F0F9F5]">
      {/* Sidebar */}
      <motion.div 
        className={`bg-[${colors.sidebarBg}] text-[${colors.sidebarText}] min-h-screen transition-all duration-300 flex flex-col`}
        style={{ width: sidebarOpen ? '280px' : isHovering ? '280px' : '80px' }}
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : isHovering ? 280 : 80 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Logo y título */}
        <div className="p-6 border-b border-[#083D38] flex items-center justify-between">
          {sidebarOpen || isHovering ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 rounded-lg bg-[#662D8F] flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </motion.div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[#662D8F] flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">A</span>
            </div>
          )}
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#83F4E9] hover:text-white ml-2"
          >
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
        
        {/* Información del usuario */}
        <div className="p-4 border-b border-[#083D38]">
          {(sidebarOpen || isHovering) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-[#83F4E9]">Administrador</p>
            </motion.div>
          )}
        </div>
        
        {/* Menú de navegación */}
        <nav className="mt-5 flex-1">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center py-3 px-6 hover:bg-[#083D38] transition-colors group"
          >
            <FaTachometerAlt className="text-lg text-[#83F4E9] group-hover:text-white" />
            {(sidebarOpen || isHovering) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-3"
              >
                Dashboard
              </motion.span>
            )}
          </Link>
          
          <Link 
            to="/admin/products" 
            className="flex items-center py-3 px-6 hover:bg-[#083D38] transition-colors group"
          >
            <FaBox className="text-lg text-[#83F4E9] group-hover:text-white" />
            {(sidebarOpen || isHovering) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-3"
              >
                Productos
              </motion.span>
            )}
          </Link>
          
          <Link 
            to="/admin/orders" 
            className="flex items-center py-3 px-6 hover:bg-[#083D38] transition-colors group"
          >
            <FaShoppingBag className="text-lg text-[#83F4E9] group-hover:text-white" />
            {(sidebarOpen || isHovering) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-3"
              >
                Órdenes
              </motion.span>
            )}
          </Link>
          
          <Link 
            to="/admin/users" 
            className="flex items-center py-3 px-6 hover:bg-[#083D38] transition-colors group"
          >
            <FaUsers className="text-lg text-[#83F4E9] group-hover:text-white" />
            {(sidebarOpen || isHovering) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-3"
              >
                Usuarios
              </motion.span>
            )}
          </Link>
        </nav>
        
        {/* Cerrar sesión */}
        <div className="p-4 border-t border-[#083D38]">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-6 hover:bg-[#083D38] rounded-lg transition-colors group"
          >
            <FaSignOutAlt className="text-lg text-[#83F4E9] group-hover:text-white" />
            {(sidebarOpen || isHovering) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-3"
              >
                Cerrar Sesión
              </motion.span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#0C4B45] hover:text-[#662D8F] focus:outline-none"
            >
              {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] flex items-center justify-center text-white font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="ml-2 text-sm font-medium text-[#0C4B45] hidden md:inline">
                  {user?.name}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F0F9F5]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t p-4 text-center text-sm text-[#0C4B45]">
          <p>© {new Date().getFullYear()} Panel de Administración - Todos los derechos reservados</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;