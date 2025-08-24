import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  FaShoppingCart, 
  FaEye, 
  FaHeart, 
  FaRegHeart, 
  FaCheck, 
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Paleta de colores premium
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

  useEffect(() => {
    const cartItem = cart.find(item => item.product._id === product._id);
    if (cartItem) {
      setIsAdded(true);
      setQuantity(cartItem.quantity);
    } else {
      setIsAdded(false);
      setQuantity(1);
    }
  }, [cart, product._id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_API_URL || ''}/uploads/products/${imagePath}`;
  };

  const images = [
    product?.image ? getImageUrl(product.image) : '/placeholder.jpg',
    ...(product?.additionalImages?.map(img => getImageUrl(img)) || [])
  ];

  const mainImage = images[selectedImage] || '/placeholder.jpg';

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, quantity);
    setIsAdded(true);
    
    // Efecto de confeti visual
    if (!isAdded) {
      // Aquí podrías agregar una animación de confeti
    }
  };

  const handleUpdateQuantity = (e, newQuantity) => {
    e.preventDefault();
    if (newQuantity < 1 || newQuantity > (product.stock || 10)) return;
    
    setQuantity(newQuantity);
    if (isAdded) updateQuantity(product._id, newQuantity);
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const calculateDiscount = () => {
    if (!product?.originalPrice || !product?.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tarjeta con efecto de elevación */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0C4B45]/10 to-[#83F4E9]/10 rounded-3xl shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300"></div>
      
      {/* Contenido principal */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-md h-full flex flex-col">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex space-x-2">
          {product?.isNew && (
            <motion.span 
              className="bg-[#F2A9FD] text-[#0C4B45] text-xs font-bold px-3 py-1 rounded-full shadow-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              NUEVO
            </motion.span>
          )}
          {product?.originalPrice && product?.price < product?.originalPrice && (
            <motion.span 
              className="bg-[#662D8F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              -{calculateDiscount()}%
            </motion.span>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button 
          onClick={toggleFavorite}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isFavorite ? (
            <FaHeart className="text-[#F2A9FD] text-lg" />
          ) : (
            <FaRegHeart className="text-gray-600 hover:text-[#F2A9FD] text-lg" />
          )}
        </motion.button>

        {/* Imagen del producto */}
        <Link to={`/product/${product?._id || '#'}`} className="block relative flex-grow">
          <div className="relative h-64 w-full bg-gradient-to-br from-[#0C4B45]/5 to-[#83F4E9]/5">
            <img 
              src={mainImage} 
              alt={product?.name || 'Producto'}
              className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              onError={(e) => e.target.src = '/placeholder.jpg'}
            />

            {/* Navegación de imágenes */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
                  }}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white text-[#662D8F]"
                >
                  <FaChevronLeft />
                </button>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedImage((prev) => (prev + 1) % images.length);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white text-[#662D8F]"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Overlay de vista rápida */}
            <AnimatePresence>
              {isHovered && (
                <motion.div 
                  className="absolute inset-0 bg-black/20 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.button 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowQuickView(true);
                    }}
                    className="bg-white text-[#662D8F] font-medium px-4 py-2 rounded-lg flex items-center hover:bg-[#662D8F] hover:text-white transition-colors shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEye className="mr-2" /> Vista Rápida
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>
        
        {/* Información del producto */}
        <div className="p-5 pt-3 flex flex-col">
          <Link to={`/product/${product?._id || '#'}`} className="mb-2">
            <h3 className="font-bold text-lg text-[#0C4B45] hover:text-[#662D8F] transition-colors line-clamp-1">
              {product?.name || 'Producto'}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product?.shortDescription || product?.description || 'Descripción no disponible'}
            </p>
          </Link>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar 
                  key={star} 
                  className={`${star <= (product?.rating || 0) ? 'text-[#F2A9FD]' : 'text-gray-300'} mr-1`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product?.reviewCount || 0})</span>
          </div>

          {/* Precio y stock */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-bold text-xl text-[#662D8F]">
                ${product?.price?.toLocaleString() || '0.00'}
              </span>
              {product?.originalPrice && product.price < product.originalPrice && (
                <span className="text-sm text-gray-400 line-through ml-2">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product?.stock !== undefined && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.stock > 5 ? 'bg-[#83F4E9]/20 text-[#0C4B45]' : 'bg-[#F2A9FD]/20 text-[#662D8F]'
              }`}>
                {product.stock > 5 ? 'Disponible' : 'Últimas unidades'}
              </span>
            )}
          </div>

          {/* Controles de cantidad y carrito */}
          <div className="flex items-center gap-3 mt-auto">
            {/* Selector de cantidad */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <button
                onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                className="px-3 py-2 hover:bg-gray-100 text-[#662D8F] transition-colors"
                disabled={quantity <= 1}
              >
                <FaMinus size={12} />
              </button>
              <span className="px-3 py-1 text-sm font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100 text-[#662D8F] transition-colors"
                disabled={quantity >= (product?.stock || 10)}
              >
                <FaPlus size={12} />
              </button>
            </div>

            {/* Botón de carrito premium */}
            <motion.button
              onClick={handleAddToCart}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center transition-all duration-300 overflow-hidden relative ${
                isAdded 
                  ? 'bg-[#83F4E9] text-[#0C4B45]' 
                  : 'bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] text-white'
              }`}
              whileHover={!isAdded ? { 
                scale: 1.02,
                boxShadow: '0 5px 15px rgba(102, 45, 143, 0.3)'
              } : {}}
              whileTap={!isAdded ? { scale: 0.98 } : {}}
            >
              {/* Efecto de onda al hacer clic */}
              {!isAdded && (
                <motion.span 
                  className="absolute inset-0 bg-white opacity-20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 10, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
              
              <span className="relative z-10 flex items-center justify-center">
                {isAdded ? (
                  <>
                    <FaCheck className="mr-2" /> Añadido
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="mr-2 text-lg" /> Comprar
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modal de Vista Rápida */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-bold text-[#0C4B45]">{product?.name}</h3>
                  <motion.button 
                    onClick={() => setShowQuickView(false)}
                    className="text-gray-500 hover:text-[#662D8F] p-2 rounded-full hover:bg-gray-100"
                    whileHover={{ rotate: 90 }}
                  >
                    ✕
                  </motion.button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-10">
                  {/* Galería de imágenes */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#0C4B45]/10 to-[#83F4E9]/10 p-8 rounded-xl flex items-center justify-center h-80">
                      <img 
                        src={mainImage} 
                        alt={product?.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-3">
                        {images.map((img, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            whileHover={{ y: -3 }}
                            className={`border-2 rounded-xl overflow-hidden transition-all ${
                              selectedImage === index 
                                ? 'border-[#662D8F] shadow-md' 
                                : 'border-transparent hover:border-gray-200'
                            }`}
                          >
                            <img 
                              src={img} 
                              alt={`Miniatura ${index + 1}`}
                              className="w-full h-20 object-cover bg-gray-50"
                            />
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Detalles del producto */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="flex mr-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar 
                            key={star} 
                            className={`text-xl mr-1 ${
                              star <= (product?.rating || 0) 
                                ? 'text-[#F2A9FD]' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product?.reviewCount || 0} reseñas)
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-8 leading-relaxed">
                      {product?.description || 'Descripción no disponible'}
                    </p>
                    
                    <div className="mb-8">
                      <span className="font-bold text-3xl text-[#662D8F]">
                        ${product?.price?.toLocaleString() || '0.00'}
                      </span>
                      {product?.originalPrice && product.price < product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through ml-3">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Barra de stock */}
                    {product?.stock !== undefined && (
                      <div className="mb-8">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Disponibilidad:</span>
                          <span className={`font-medium ${
                            product.stock > 5 ? 'text-[#0C4B45]' : 'text-[#662D8F]'
                          }`}>
                            {product.stock} unidades disponibles
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-full rounded-full ${
                              product.stock > 5 ? 'bg-[#83F4E9]' : 'bg-[#F2A9FD]'
                            }`} 
                            style={{ 
                              width: `${Math.min(100, (product.stock / 10) * 100)}%`,
                              transition: 'width 0.5s ease'
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Selector de cantidad */}
                    <div className="flex items-center gap-6 mb-8">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                        <button
                          onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                          className="px-4 py-3 hover:bg-gray-100 text-[#662D8F] transition-colors"
                          disabled={quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="px-5 py-2 font-medium text-lg w-12 text-center">{quantity}</span>
                        <button
                          onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                          className="px-4 py-3 hover:bg-gray-100 text-[#662D8F] transition-colors"
                          disabled={quantity >= (product?.stock || 10)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex space-x-4">
                      <motion.button
                        onClick={(e) => {
                          handleAddToCart(e);
                          setShowQuickView(false);
                        }}
                        className={`flex-1 py-4 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                          isAdded 
                            ? 'bg-[#83F4E9] text-[#0C4B45]' 
                            : 'bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] text-white'
                        }`}
                        whileHover={!isAdded ? { 
                          scale: 1.02,
                          boxShadow: '0 5px 20px rgba(102, 45, 143, 0.4)'
                        } : {}}
                        whileTap={!isAdded ? { scale: 0.98 } : {}}
                      >
                        <span className="relative z-10 flex items-center text-lg font-medium">
                          {isAdded ? (
                            <>
                              <FaCheck className="mr-3" /> Añadido al carrito
                            </>
                          ) : (
                            <>
                              <FaShoppingCart className="mr-3 text-xl" /> Agregar al carrito
                            </>
                          )}
                        </span>
                      </motion.button>
                      
                      <motion.button
                        onClick={toggleFavorite}
                        className={`p-4 rounded-xl flex items-center justify-center text-xl ${
                          isFavorite 
                            ? 'bg-[#F2A9FD]/20 text-[#662D8F]' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isFavorite ? <FaHeart /> : <FaRegHeart />}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;