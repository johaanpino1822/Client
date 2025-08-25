import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaRegHeart, 
  FaStar, 
  FaChevronLeft, 
  FaChevronRight, 
  FaCheck, 
  FaShare, 
  FaExpand,
  FaMinus, 
  FaPlus 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Paleta de colores premium
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data.data);
        if (res.data.data.colors?.length) {
          setSelectedColor(res.data.data.colors[0]);
        }
        if (res.data.data.sizes?.length) {
          setSelectedSize(res.data.data.sizes[0]);
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
        toast.error('Error al cargar el producto');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product || quantity < 1) return;

    setIsAddingToCart(true);
    
    try {
      addToCart({
        ...product,
        selectedColor,
        selectedSize
      }, quantity);

      toast.success(
        <div className="flex items-start">
          <div className="bg-[#83F4E9] p-2 rounded-lg mr-3">
            <FaCheck className="text-[#0C4B45] text-xl" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-600">Agregado al carrito</p>
          </div>
        </div>, 
        {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: true,
          closeButton: false,
          className: "bg-white border-l-4 border-[#662D8F] shadow-xl rounded-lg"
        }
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % (product?.images?.length || 1));
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `/uploads/products/${imagePath}`;
  };

  const isInCart = cart.some(item => item.product._id === product?._id);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0C4B45]/5 to-[#83F4E9]/5">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 h-[500px] bg-gray-100 rounded-l-3xl"></div>
              <div className="p-10 md:w-1/2 space-y-6">
                <div className="h-10 bg-gray-100 rounded-full w-3/4"></div>
                <div className="h-6 bg-gray-100 rounded-full w-1/2"></div>
                <div className="h-32 bg-gray-100 rounded-2xl"></div>
                <div className="h-14 bg-gray-100 rounded-full w-1/3"></div>
                <div className="h-16 bg-gray-100 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-b from-[#0C4B45]/5 to-[#83F4E9]/5">
        <div className="text-center max-w-md p-8 bg-white rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold text-[#0C4B45] mb-4">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">Lo sentimos, no pudimos encontrar el producto que buscas.</p>
          <motion.button 
            onClick={() => navigate('/')}
            className="w-full py-3 px-6 bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] text-white rounded-xl font-medium hover:from-[#512577] hover:to-[#e895fc] transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Volver a la tienda
          </motion.button>
        </div>
      </div>
    );
  }

  const images = [
    product.image ? getImageUrl(product.image) : '/placeholder.jpg',
    ...(product.additionalImages?.map(img => getImageUrl(img))) || []
  ];

  const mainImage = images[selectedImage] || '/placeholder.jpg';

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0C4B45]/5 to-[#83F4E9]/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="md:flex">
            {/* Gallery Section */}
            <div className="md:w-1/2 relative">
              <div className="relative h-[500px] bg-gradient-to-br from-[#0C4B45]/10 to-[#83F4E9]/10 flex items-center justify-center p-10">
                <motion.img
                  src={mainImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain cursor-zoom-in"
                  onClick={() => setShowFullscreenImage(true)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                />
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <motion.button 
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaChevronLeft className="text-[#662D8F] text-lg" />
                    </motion.button>
                    <motion.button 
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaChevronRight className="text-[#662D8F] text-lg" />
                    </motion.button>
                  </>
                )}
                
                {/* Fullscreen Button */}
                <motion.button
                  onClick={(e) => { e.stopPropagation(); setShowFullscreenImage(true); }}
                  className="absolute bottom-6 right-6 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaExpand className="text-[#662D8F] text-lg" />
                </motion.button>
                
                {/* Image Indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
                    {images.map((_, index) => (
                      <motion.button 
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(index); }}
                        className={`w-3 h-3 rounded-full transition-all ${selectedImage === index ? 'bg-[#662D8F] scale-125' : 'bg-gray-300 hover:bg-[#F2A9FD]'}`}
                        whileHover={{ scale: 1.2 }}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-6 flex space-x-4 overflow-x-auto">
                  {images.map((img, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 rounded-xl overflow-hidden transition-all ${selectedImage === index ? 'border-[#662D8F] shadow-md' : 'border-transparent hover:border-gray-200'}`}
                      whileHover={{ y: -3 }}
                    >
                      <img 
                        src={img} 
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover bg-gray-50"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info Section */}
            <div className="p-10 md:w-1/2">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-[#0C4B45] mb-3">{product.name}</h1>
                  <div className="flex items-center mb-5">
                    <div className="flex mr-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                          key={star} 
                          className={`text-xl ${star <= (product.rating || 0) ? 'text-[#F2A9FD]' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviewCount || 0} reseñas)</span>
                  </div>
                </div>
                
                <motion.button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isFavorite ? (
                    <FaHeart className="text-2xl text-[#F2A9FD]" />
                  ) : (
                    <FaRegHeart className="text-2xl text-gray-400 hover:text-[#F2A9FD]" />
                  )}
                </motion.button>
              </div>
              
              <div className="mb-8">
                <div className="flex items-end">
                  <span className="font-bold text-4xl text-[#662D8F]">
                    ${product.price?.toLocaleString() || '0.00'}
                  </span>
                  {product.originalPrice && product.price < product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through ml-4">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.discount > 0 && (
                  <span className="inline-block mt-2 bg-[#F2A9FD]/20 text-[#662D8F] text-sm font-bold px-3 py-1 rounded-full">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">{product.description}</p>
              
              {/* Color Selection */}
              {product.colors?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-[#0C4B45] mb-3">Color:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <motion.button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${selectedColor === color ? 'border-[#662D8F]' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${color}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {selectedColor === color && (
                          <FaCheck className="text-white text-xs drop-shadow-md" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Size Selection */}
              {product.sizes?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-[#0C4B45] mb-3">Talla:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2 border-2 rounded-lg text-md font-medium ${selectedSize === size ? 'bg-[#662D8F] text-white border-[#662D8F]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        whileHover={{ y: -2 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Stock Indicator */}
              <div className="mb-8">
                <div className="flex justify-between text-md mb-2">
                  <span className="text-gray-700">Disponibilidad:</span>
                  <span className={`font-medium ${product.stock > 5 ? 'text-[#0C4B45]' : 'text-[#662D8F]'}`}>
                    {product.stock} en stock
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div 
                    className={`h-full rounded-full ${product.stock > 5 ? 'bg-[#83F4E9]' : 'bg-[#F2A9FD]'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (product.stock / 10) * 100)}%` }}
                    transition={{ duration: 0.8, type: 'spring' }}
                  />
                </div>
              </div>
              
              {/* Quantity and Add to Cart */}
              <div className="mb-10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <motion.button 
                      onClick={decrementQuantity}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaMinus className="text-md" />
                    </motion.button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-16 text-center border-t-0 border-b-0 focus:ring-0 focus:border-gray-300 text-lg font-medium"
                    />
                    <motion.button 
                      onClick={incrementQuantity}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaPlus className="text-md" />
                    </motion.button>
                  </div>
                  
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={isInCart || isAddingToCart}
                    className={`flex-1 py-4 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                      isInCart 
                        ? 'bg-[#83F4E9] text-[#0C4B45]' 
                        : 'bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] text-white hover:from-[#512577] hover:to-[#e895fc]'
                    }`}
                    whileHover={!isInCart ? { 
                      scale: 1.02,
                      boxShadow: '0 5px 15px rgba(102, 45, 143, 0.3)'
                    } : {}}
                    whileTap={!isInCart ? { scale: 0.98 } : {}}
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Procesando...
                      </div>
                    ) : isInCart ? (
                      <>
                        <FaCheck className="mr-3 text-xl" /> En el carrito
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="mr-3 text-xl" /> Agregar al carrito
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4 text-md">
                  <div>
                    <span className="text-gray-500">Categoría:</span>
                    <span className="ml-2 font-medium text-[#0C4B45]">{product.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">SKU:</span>
                    <span className="ml-2 font-medium text-[#0C4B45]">{product.sku || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Marca:</span>
                    <span className="ml-2 font-medium text-[#0C4B45]">{product.brand || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Envío:</span>
                    <span className="ml-2 font-medium text-[#0C4B45]">Gratis en pedidos +$50</span>
                  </div>
                </div>
              </div>
              
              {/* Share Buttons */}
              <div className="mt-8">
                <motion.button 
                  className="flex items-center text-md text-gray-500 hover:text-[#662D8F]"
                  whileHover={{ x: 3 }}
                >
                  <FaShare className="mr-3 text-lg" /> Compartir este producto
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {showFullscreenImage && (
          <motion.div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative max-w-6xl w-full max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <motion.button
                onClick={() => setShowFullscreenImage(false)}
                className="absolute top-6 right-6 text-white text-4xl z-10 hover:text-[#F2A9FD] transition-colors"
                whileHover={{ rotate: 90, scale: 1.1 }}
              >
                &times;
              </motion.button>
              
              <div className="relative h-full w-full flex items-center justify-center">
                <motion.img
                  src={mainImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
                
                {images.length > 1 && (
                  <>
                    <motion.button 
                      onClick={prevImage}
                      className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-4 rounded-full text-white text-xl"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaChevronLeft />
                    </motion.button>
                    <motion.button 
                      onClick={nextImage}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-4 rounded-full text-white text-xl"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaChevronRight />
                    </motion.button>
                    
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
                      {images.map((_, index) => (
                        <motion.button 
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-3 h-3 rounded-full transition-all ${selectedImage === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
                          whileHover={{ scale: 1.2 }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductPage;