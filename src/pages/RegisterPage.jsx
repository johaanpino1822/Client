import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  
  
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    
    // Calcular fortaleza de contraseña
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 6) strength += 1;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    
    if (name.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor ingrese un email válido');
      return false;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (!acceptedTerms) {
      setError('Debe aceptar los términos y condiciones');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('http://localhost:5000/api/users/register', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (response.data.success) {
        setSuccess(true);
        login(response.data.token, response.data.user);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(response.data.message || 'Error en el registro');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         'Error al registrar el usuario';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-emerald-600';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0: return 'Muy débil';
      case 1: return 'Débil';
      case 2: return 'Moderada';
      case 3: return 'Fuerte';
      case 4: return 'Muy fuerte';
      case 5: return 'Excelente';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f5] to-[#e0f3eb] flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <motion.div 
            className="mx-auto bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <UserIcon className="h-12 w-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-[#0C4B45] tracking-tight">
            Crear Cuenta
          </h2>
          <p className="mt-3 text-[#4A6B57] font-light">
            Únete a nuestra plataforma
          </p>
        </div>

        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#e0f3eb]"
          whileHover={{ y: -3 }}
        >
          <div className="px-10 py-12 sm:p-12">
            {success && (
              <motion.div 
                className="mb-8 bg-[#E8F5E9] rounded-xl py-4 px-5 flex items-center border border-[#C8E6C9]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <CheckCircleIcon className="h-6 w-6 text-[#2E7D32] mr-3" />
                <span className="text-[#1B5E20] font-medium">¡Registro exitoso! Redirigiendo...</span>
              </motion.div>
            )}

            {error && (
              <motion.div 
                className="mb-8 bg-[#FFEBEE] rounded-xl py-4 px-5 flex items-start border border-[#FFCDD2]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ExclamationCircleIcon className="h-6 w-6 text-[#C62828] mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-[#B71C1C]">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#4A6B57] mb-2">
                  Nombre completo
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-[#81C784]" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength="3"
                    className="block w-full pl-10 pr-4 py-3 text-[#2E7D32] border border-[#A5D6A7] rounded-lg shadow-sm placeholder-[#81C784] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] sm:text-sm bg-[#E8F5E9]/30"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4A6B57] mb-2">
                  Correo electrónico
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-[#81C784]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-4 py-3 text-[#2E7D32] border border-[#A5D6A7] rounded-lg shadow-sm placeholder-[#81C784] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] sm:text-sm bg-[#E8F5E9]/30"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#4A6B57] mb-2">
                  Contraseña
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-[#81C784]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength="6"
                    className="block w-full pl-10 pr-10 py-3 text-[#2E7D32] border border-[#A5D6A7] rounded-lg shadow-sm placeholder-[#81C784] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] sm:text-sm bg-[#E8F5E9]/30"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-[#4A6B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-[#4A6B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#4A6B57]">Fortaleza de la contraseña:</span>
                      <span className="text-xs font-medium text-[#2E7D32]">{getPasswordStrengthText()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`} 
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#4A6B57] mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-[#81C784]" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength="6"
                    className="block w-full pl-10 pr-10 py-3 text-[#2E7D32] border border-[#A5D6A7] rounded-lg shadow-sm placeholder-[#81C784] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] sm:text-sm bg-[#E8F5E9]/30"
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-[#4A6B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-[#4A6B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    checked={acceptedTerms}
                    onChange={() => setAcceptedTerms(!acceptedTerms)}
                    className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-[#A5D6A7] rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-[#4A6B57]">
                    Acepto los <Link to="/terms" className="font-medium text-[#2E7D32] hover:text-[#1B5E20]">términos y condiciones</Link> y la <Link to="/privacy" className="font-medium text-[#2E7D32] hover:text-[#1B5E20]">política de privacidad</Link>
                  </label>
                </div>
              </div>

              <motion.div
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] hover:from-[#2E7D32] hover:to-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50] ${loading ? 'opacity-90 cursor-not-allowed' : ''} transition-all duration-300`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Registrarme
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>

          <div className="bg-[#F1F8E9] px-10 py-6 border-t border-[#DCEDC8]">
            <p className="text-sm text-[#689F38] text-center">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-[#2E7D32] hover:text-[#1B5E20]">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;