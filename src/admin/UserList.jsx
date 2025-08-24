import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaTrash, FaEdit, FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserList = () => {
  // Estados principales
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // 10 usuarios por página
  const [totalUsers, setTotalUsers] = useState(0);

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
    background: '#F0F9F5'
  };

  // Obtener usuarios con paginación
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/admin/users?page=${currentPage}&limit=${usersPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const usersData = res.data?.data || [];
      const total = res.data?.total || 0;

      if (Array.isArray(usersData)) {
        setUsers(usersData);
        setFilteredUsers(usersData);
        setTotalUsers(total);
      } else {
        console.error('❌ La respuesta no es un arreglo válido:', res.data);
        setUsers([]);
        setFilteredUsers([]);
      }

    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      setError('Error al cargar los usuarios');
      toast.error('Error al cargar los usuarios', {
        position: "top-right",
        className: 'bg-white border-l-4 border-red-500 shadow-lg'
      });
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, usersPerPage]);

  // Filtrar usuarios
  useEffect(() => {
    const result = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(result);
  }, [searchTerm, users]);

  // Eliminar usuario
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizar lista después de eliminar
      const updatedUsers = users.filter(user => user._id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setTotalUsers(prev => prev - 1);

      toast.success(
        <div className="flex items-center">
          <FaTrash className="text-[#0C4B45] mr-2" />
          <span>Usuario eliminado correctamente</span>
        </div>,
        {
          position: "top-right",
          className: 'bg-white border-l-4 border-[#662D8F] shadow-lg'
        }
      );

      // Si la página queda vacía y no es la primera, retroceder
      if (updatedUsers.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
      toast.error('Error al eliminar usuario', {
        position: "top-right",
        className: 'bg-white border-l-4 border-red-500 shadow-lg'
      });
    }
  };

  // Editar usuario (placeholder para implementación futura)
  const handleEdit = (user) => {
    toast.info(
      <div className="flex items-center">
        <FaEdit className="text-[#0C4B45] mr-2" />
        <span>Función de edición en desarrollo</span>
      </div>,
      {
        position: "top-right",
        className: 'bg-white border-l-4 border-blue-500 shadow-lg'
      }
    );
  };

  // Lógica de paginación
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const maxVisiblePages = 5; // Máximo número de páginas visibles en la paginación

  const getPaginationRange = () => {
    const range = [];
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const paginationRange = getPaginationRange();

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Estados de carga
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0C4B45]/5 to-[#83F4E9]/5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#662D8F] border-t-transparent rounded-full"
        />
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg text-[#0C4B45] font-medium"
        >
          Cargando lista de usuarios...
        </motion.p>
      </div>
    );
  }

  // Manejo de errores
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0C4B45]/5 to-[#83F4E9]/5 p-6">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0C4B45] mb-2">Error al cargar usuarios</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] text-white rounded-xl font-medium hover:from-[#512577] hover:to-[#e895fc] transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reintentar
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C4B45]/5 to-[#83F4E9]/5 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0C4B45]">Gestión de Usuarios</h1>
              <p className="text-[#0C4B45]/80">Administra los usuarios registrados en el sistema</p>
            </div>
            
            {/* Barra de búsqueda */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-[#0C4B45]/60" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, email o rol..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0C4B45] uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0C4B45] uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0C4B45] uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0C4B45] uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#0C4B45] uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-[#F2A9FD] text-[#662D8F]' 
                          : 'bg-[#83F4E9] text-[#0C4B45]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          onClick={() => handleEdit(user)}
                          className="text-[#0C4B45] hover:text-[#083D38]"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaEdit className="text-lg" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-700"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTrash className="text-lg" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Mostrando {(currentPage - 1) * usersPerPage + 1} - {Math.min(currentPage * usersPerPage, totalUsers)} de {totalUsers} usuarios
            </div>
            
            <div className="flex items-center space-x-1">
              {/* Botón Primera Página */}
              <motion.button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#662D8F] hover:bg-[#F2A9FD]/20'}`}
                whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              >
                <FaAngleDoubleLeft />
              </motion.button>

              {/* Botón Página Anterior */}
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#662D8F] hover:bg-[#F2A9FD]/20'}`}
                whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              >
                <FaAngleLeft />
              </motion.button>

              {/* Números de página */}
              {paginationRange.map((page) => (
                <motion.button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] text-white shadow-md'
                      : 'text-[#0C4B45] hover:bg-[#83F4E9]/20'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page}
                </motion.button>
              ))}

              {/* Botón Página Siguiente */}
              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#662D8F] hover:bg-[#F2A9FD]/20'}`}
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              >
                <FaAngleRight />
              </motion.button>

              {/* Botón Última Página */}
              <motion.button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#662D8F] hover:bg-[#F2A9FD]/20'}`}
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              >
                <FaAngleDoubleRight />
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;