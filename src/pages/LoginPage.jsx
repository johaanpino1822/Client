import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ExclamationCircleIcon, 
  UserCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  KeyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Paleta de colores
  const colors = {
    primary: '#0C4B45',
    primaryDark: '#083D38',
    primaryLight: '#83F4E9',
    secondary: '#662D8F',
    secondaryLight: '#F2A9FD',
    error: '#EF5350',
    success: '#4CAF50',
    backgroundLight: '#F0F9F5',
    backgroundLighter: '#E0F3EB',
    textDark: '#0C4B45',
    textMedium: '#4A6B57'
  };

  useEffect(() => {
    setIsAdminLogin(location.pathname.includes('admin'));
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email || !password) {
      setError('Email y contraseña son requeridos');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Por favor ingrese un email válido');
      return false;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const credentials = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      const result = await login(credentials);
      
      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.user) {
        setSuccess(true);
        
        setTimeout(() => {
          if (result.user.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/products', { replace: true });
          }
        }, 1000);
      } else {
        throw new Error('No se recibieron datos de usuario válidos');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'Ocurrió un error durante el login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex mt-16 items-center justify-center p-4"
      style={{ 
        background: `linear-gradient(135deg, ${colors.backgroundLight} 0%, ${colors.backgroundLighter} 100%)`
      }}
    >
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Encabezado */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div 
            className={`mx-auto ${
              isAdminLogin 
                ? `bg-gradient-to-br from-[${colors.secondary}] to-[${colors.secondaryLight}]`
                : `bg-gradient-to-br from-[${colors.primary}] to-[${colors.primaryDark}]`
            } w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAdminLogin ? (
              <ShieldCheckIcon className="h-12 w-12 text-white" />
            ) : (
              <UserCircleIcon className="h-12 w-12 text-white" />
            )}
          </motion.div>
          <h2 className="text-3xl font-bold" style={{ color: colors.textDark }}>
            {isAdminLogin ? 'Acceso Administrativo' : 'Bienvenido de vuelta'}
          </h2>
          <p className="mt-3 font-light" style={{ color: colors.textMedium }}>
            {isAdminLogin ? 'Ingrese sus credenciales autorizadas' : 'Inicie sesión para continuar'}
          </p>
        </motion.div>

        {/* Tarjeta de Login */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          style={{ 
            borderColor: colors.primaryLight,
            boxShadow: `0 10px 25px -5px rgba(${hexToRgb(colors.primaryDark)}, 0.1)`
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="px-10 py-12 sm:p-12">
            {success && (
              <div className="mb-8 rounded-xl py-4 px-5 flex items-center"
                style={{ 
                  backgroundColor: `${colors.primaryLight}20`,
                  borderColor: colors.primaryLight
                }}>
                <svg 
                  className="h-6 w-6 mr-3" 
                  style={{ color: colors.success }} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium" style={{ color: colors.success }}>
                  {isAdminLogin 
                    ? 'Redirigiendo al panel de administración...' 
                    : 'Redirigiendo a nuestros productos...'}
                </span>
              </div>
            )}

            {error && (
              <div className="mb-8 rounded-xl py-4 px-5 flex items-start"
                style={{ 
                  backgroundColor: `${colors.error}20`, 
                  borderColor: colors.error
                }}>
                <ExclamationCircleIcon 
                  className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" 
                  style={{ color: colors.error }} 
                />
                <span style={{ color: colors.error }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium mb-2" 
                  style={{ color: colors.textMedium }}
                >
                  Correo electrónico
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon 
                      className="h-5 w-5" 
                      style={{ color: colors.primary }} 
                    />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none sm:text-sm"
                    style={{ 
                      color: colors.textDark,
                      borderColor: error && error.includes('email') ? colors.error : colors.primaryLight,
                      backgroundColor: `${colors.primaryLight}10`,
                    }}
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium mb-2" 
                  style={{ color: colors.textMedium }}
                >
                  Contraseña
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon 
                      className="h-5 w-5" 
                      style={{ color: colors.primary }} 
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    minLength="6"
                    className="block w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none sm:text-sm"
                    style={{ 
                      color: colors.textDark,
                      borderColor: error && error.includes('contraseña') ? colors.error : colors.primaryLight,
                      backgroundColor: `${colors.primaryLight}10`,
                    }}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    style={{ 
                      color: colors.primary,
                      borderColor: colors.primaryLight,
                    }}
                  />
                  <label 
                    htmlFor="remember-me" 
                    className="ml-2 block text-sm" 
                    style={{ color: colors.textMedium }}
                  >
                    Recordar sesión
                  </label>
                </div>
                <div className="text-sm">
                  <Link 
                    to={isAdminLogin ? "/admin/forgot-password" : "/forgot-password"} 
                    className="font-medium transition-colors hover:underline"
                    style={{ 
                      color: colors.secondary,
                    }}
                  >
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                  loading ? 'opacity-90 cursor-not-allowed' : ''
                }`}
                style={{
                  background: isAdminLogin 
                    ? `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryLight} 100%)`
                    : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                }}
                whileHover={!loading ? { 
                  scale: 1.02, 
                  boxShadow: `0 10px 25px -5px rgba(${hexToRgb(colors.primaryDark)}, 0.2)`
                } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    {isAdminLogin ? 'Acceder al sistema' : 'Iniciar sesión'}
                    <ArrowRightIcon className="ml-3 h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>

            {!isAdminLogin && (
              <div className="mt-10">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: colors.primaryLight }}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white" style={{ color: colors.textMedium }}>
                      ¿Nuevo en nuestra plataforma?
                    </span>
                  </div>
                </div>

                <motion.div 
                  className="mt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/register"
                    className="w-full flex justify-center py-3 px-6 rounded-xl shadow-sm text-base font-medium transition-all duration-300"
                    style={{ 
                      border: `1px solid ${colors.secondaryLight}`,
                      color: colors.secondary,
                      backgroundColor: 'white',
                    }}
                  >
                    Crear una cuenta
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          <div 
            className="px-10 py-6 border-t" 
            style={{ 
              backgroundColor: `${colors.primaryLight}10`, 
              borderColor: colors.primaryLight 
            }}
          >
            <p className="text-xs text-center" style={{ color: colors.textMedium }}>
              Al iniciar sesión, aceptas nuestros{' '}
              <Link 
                to={isAdminLogin ? "/admin/terms" : "/terms"} 
                className="font-medium transition-colors hover:underline"
                style={{ color: colors.secondary }}
              >
                Términos de servicio
              </Link>{' '}
              y{' '}
              <Link 
                to={isAdminLogin ? "/admin/privacy" : "/privacy"} 
                className="font-medium transition-colors hover:underline"
                style={{ color: colors.secondary }}
              >
                Política de privacidad
              </Link>
            </p>
          </div>
        </motion.div>

        <div className="mt-8 text-center text-sm">
          <p style={{ color: colors.textMedium }}>
            {isAdminLogin ? (
              <>
                ¿Eres cliente?{' '}
                <Link 
                  to="/login" 
                  className="font-medium transition-colors flex items-center justify-center hover:underline"
                  style={{ color: colors.secondary }}
                >
                  Accede a tu cuenta aquí <SparklesIcon className="ml-1 h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                ¿Eres administrador?{' '}
                <Link 
                  to="/admin/login" 
                  className="font-medium transition-colors flex items-center justify-center hover:underline"
                  style={{ color: colors.secondary }}
                >
                  Acceso administrativo <ShieldCheckIcon className="ml-1 h-4 w-4" />
                </Link>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Función auxiliar para convertir hex a rgb
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default LoginPage;