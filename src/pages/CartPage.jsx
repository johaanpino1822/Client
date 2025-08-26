import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const CartPage = () => {
  const { 
    cartItems = [], 
    clearCart, 
    removeFromCart, 
    updateCartItem,
    subtotal = 0 
  } = useCart();
  
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    postalCode: '',
    legalId: '',
    legalIdType: 'CC'
  });
  const [acceptanceToken, setAcceptanceToken] = useState('');
  const [wompiWidgetLoaded, setWompiWidgetLoaded] = useState(false);

  // Configuración para producción
  const WOMPI_API_URL = 'https://production.wompi.co/v1';
  
  const WOMPI_MERCHANT_ID = process.env.REACT_APP_WOMPI_MERCHANT_ID || '1552149';
  const API_URL = process.env.REACT_APP_API_URL || 'https://server-21pdm2e1h-jdpino3146396-gmailcoms-projects.vercel.app';

  // Función para manejar las URLs de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}/uploads/products/${imagePath}`;
  };

  // Función asíncrona para generar firma de integridad
  const generateIntegritySignature = async (reference, amount, currency) => {
    try {
      const secretKey = process.env.REACT_APP_WOMPI_INTEGRITY_SECRET || 'prod_integrity_eNbECYglk1XeAtwswDTPxX29Dy9kc4Ag';
      
      const data = `${reference}${amount}${currency}${secretKey}`;
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Error generando firma:', error);
      throw new Error('Error al generar la firma de seguridad');
    }
  };

  useEffect(() => {
    // Cargar widget de Wompi para producción
    const loadWompiWidget = () => {
      if (window.Wompi) {
        setWompiWidgetLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.wompi.co/widget.js';
      script.async = true;
      script.onload = () => {
        setWompiWidgetLoaded(true);
        console.log('Wompi widget loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load Wompi widget');
        setError('Error al cargar el sistema de pagos. Recarga la página.');
      };
      document.body.appendChild(script);
    };

    loadWompiWidget();

    // Obtener acceptance token
    const fetchAcceptanceToken = async () => {
      try {
        const response = await axios.get(
          `${WOMPI_API_URL}/merchants/${WOMPI_MERCHANT_ID}`,
          {
            timeout: 10000,
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_WOMPI_PRIVATE_KEY}`
            }
          }
        );
        
        if (!response.data.data?.presigned_acceptance?.acceptance_token) {
          throw new Error('No se recibió el token de aceptación');
        }
        
        setAcceptanceToken(response.data.data.presigned_acceptance.acceptance_token);
      } catch (error) {
        console.error("Error obteniendo acceptance token:", error);
        setError("Error al conectar con el procesador de pagos. Intenta recargar la página.");
      }
    };

    fetchAcceptanceToken();
  }, [WOMPI_API_URL, WOMPI_MERCHANT_ID]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userShippingInfo = {
        name: user.name || '',
        email: user.email || '',
        ...(user.shippingAddress || {}),
        legalId: user.legalId || '',
        legalIdType: user.legalIdType || 'CC'
      };
      setShippingInfo(prev => ({ ...prev, ...userShippingInfo }));
    }
  }, [isAuthenticated, user]);

  const shipping = subtotal > 100000 ? 0 : 8000;
  const total = subtotal + shipping;

  const validateForm = () => {
    setError('');
    setSuccess('');

    if (!wompiWidgetLoaded) {
      setError('El sistema de pagos se está cargando. Espera un momento.');
      return false;
    }

    if (!acceptanceToken) {
      setError('El sistema de pagos no está disponible temporalmente. Intenta nuevamente más tarde.');
      return false;
    }

    const requiredFields = ['name', 'email', 'address', 'city', 'state', 'phone', 'legalId'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field]?.trim());

    if (missingFields.length > 0) {
      setError(`Por favor completa todos los campos requeridos: ${missingFields.join(', ')}`);
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(shippingInfo.email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return false;
    }

    const phoneDigits = shippingInfo.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('El teléfono debe tener al menos 10 dígitos');
      return false;
    }

    if (!shippingInfo.legalId || !/^[0-9]{6,12}$/.test(shippingInfo.legalId)) {
      setError('Documento de identidad inválido. Debe tener entre 6 y 12 dígitos');
      return false;
    }

    return true;
  };

  const generateCardToken = async (cardData) => {
    return new Promise((resolve, reject) => {
      if (!window.Wompi) {
        reject(new Error('Widget de Wompi no cargado'));
        return;
      }

      window.Wompi.tokenizeCard(cardData)
        .then(result => {
          if (result.error) {
            reject(new Error(result.error.message));
          } else {
            resolve(result.token);
          }
        })
        .catch(reject);
    });
  };

  const createOrder = async (orderData, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/orders`, 
        orderData, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );
      
      if (!response?.data?.success || !response?.data?.order?._id) {
        throw new Error('No se pudo crear la orden');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw new Error(error.response?.data?.error || 'Error al crear la orden');
    }
  };

  const createWompiPayment = async (orderId, token) => {
    try {
      const amountInCents = Math.round(total * 100);
      const phoneDigits = shippingInfo.phone.replace(/\D/g, '');
      const formattedPhone = phoneDigits.startsWith('57') ? phoneDigits : '57' + phoneDigits;

      const freshPaymentToken = await generateCardToken({
        number: "4242424242424242",
        exp_month: "12",
        exp_year: "29", 
        cvc: "123",
        card_holder: shippingInfo.name.trim()
      });

      const reference = `ORD-${orderId}-${Date.now()}`;
      
      const signature = await generateIntegritySignature(reference, amountInCents, 'COP');
      
      const payload = {
        amount_in_cents: amountInCents,
        currency: 'COP',
        customer_email: shippingInfo.email.trim().toLowerCase(),
        payment_method: {
          type: 'CARD',
          installments: 1,
          token: freshPaymentToken,
          payment_source_id: null
        },
        reference: reference,
        redirect_url: `${window.location.origin}/order/${orderId}`,
        customer_data: {
          full_name: shippingInfo.name.trim(),
          phone_number: formattedPhone,
          email: shippingInfo.email.trim().toLowerCase(),
          legal_id_type: shippingInfo.legalIdType || 'CC',
          legal_id: shippingInfo.legalId.toString()
        },
        acceptance_token: acceptanceToken,
        signature: signature
      };

      const response = await axios.post(
        `${API_URL}/api/wompi/create-transaction`,
        payload,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.error || 'No se recibió respuesta válida de Wompi');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en pago Wompi:', error);
      let errorMessage = 'Error al procesar el pago';
      
      if (error.response?.data?.details) {
        errorMessage += `: ${error.response.data.details.join(', ')}`;
      } else if (error.response?.data?.error?.messages) {
        errorMessage += `: ${Object.entries(error.response.data.error.messages)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ')}`;
      } else {
        errorMessage += `: ${error.message}`;
      }
      
      throw new Error(errorMessage);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError('Tu carrito está vacío');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para continuar con la compra');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || null
        })),
        shippingAddress: {
          name: shippingInfo.name.trim(),
          email: shippingInfo.email.trim().toLowerCase(),
          address: shippingInfo.address.trim(),
          city: shippingInfo.city.trim(),
          state: shippingInfo.state.trim(),
          postalCode: shippingInfo.postalCode?.trim() || '000000',
          phone: shippingInfo.phone.replace(/\D/g, ''),
          legalId: shippingInfo.legalId,
          legalIdType: shippingInfo.legalIdType
        },
        paymentMethod: 'credit_card',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total
      };

      const orderResponse = await createOrder(orderData, token);
      const orderId = orderResponse.order._id;

      const wompiResponse = await createWompiPayment(orderId, token);

      clearCart();
      setSuccess('Orden creada exitosamente. Redirigiendo a Wompi...');
      
      setTimeout(() => {
        window.location.href = wompiResponse.data.paymentUrl || 
          wompiResponse.data.redirect_url || 
          `${window.location.origin}/order/${orderId}`;
      }, 1500);

    } catch (error) {
      console.error('Error en checkout:', error);
      setError(error.message || 'Error al procesar el pedido. Verifica tus datos e intenta nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    setError('');
    setSuccess('');
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, { quantity: newQuantity });
    }
    setError('');
    setSuccess('');
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ArrowPathIcon className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Tu Carrito de Compras</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{error}</p>
            <div className="mt-2 flex space-x-3">
              <button 
                onClick={() => window.location.reload()}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Recargar página
              </button>
              <button 
                onClick={() => setError('')}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 mb-6 rounded flex items-start">
          <CheckCircleIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
          <p className="font-medium">{success}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <CreditCardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-6 text-lg">No hay productos en tu carrito</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
              >
                Descubrir Productos
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Productos en el carrito</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <li key={item._id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="h-20 w-20 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                        <h3 className="text-lg font-medium text-gray-900 truncate mb-2 sm:mb-0">
                          {item.name}
                        </h3>
                        <p className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-gray-600 mb-3">${item.price.toLocaleString()} c/u</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar producto"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Envío</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? '¡Gratis!' : `$${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    ¡Envío gratis por compra superior a $100.000!
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b pb-2">Información de Envío</h3>
              
              {/* Campos del formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documento de identidad *
                  </label>
                  <input
                    type="text"
                    name="legalId"
                    value={shippingInfo.legalId}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, legalId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={processing || cartItems.length === 0 || !acceptanceToken || !wompiWidgetLoaded}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white mt-4 transition-all duration-200 ${
                  processing || cartItems.length === 0 || !acceptanceToken || !wompiWidgetLoaded
                    ? 'bg-gray-400 cursor-not-allowed transform-none'
                    : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:scale-105'
                } flex items-center justify-center space-x-2`}
              >
                {processing ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-5 w-5" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-5 w-5" />
                    <span>Pagar con Wompi</span>
                  </>
                )}
              </button>

              {!wompiWidgetLoaded && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Cargando sistema de pagos seguro...
                </p>
              )}
            </form>
          </div>

          {cartItems.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
              <div className="flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700">
                    <strong>Pago seguro:</strong> Tus datos están protegidos con encriptación SSL
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;