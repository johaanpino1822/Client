import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaSearch, 
  FaFilter, 
  FaSortAmountDown, 
  FaTimes, 
  FaStar, 
  FaRegStar, 
  FaShoppingCart,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaMinus,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductsListPage = () => {
  // Estados principales
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // 12 productos por página
  const [totalProducts, setTotalProducts] = useState(0);

  const { cart, addToCart, updateQuantity } = useCart();

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

  // Obtener productos con paginación
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products?page=${currentPage}&limit=${productsPerPage}`);
        setProducts(res.data.data || res.data.products);
        setTotalProducts(res.data.total || res.data.totalProducts || res.data.length);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar los productos');
        toast.error('Error al cargar los productos', {
          position: "top-right",
          className: 'bg-white border-l-4 border-red-500 shadow-lg'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, productsPerPage]);

  // Manejar imágenes
  const getImageUrl = (imageName) => {
    if (!imageName) return '/placeholder.jpg';
    if (imageName.startsWith('http')) return imageName;
    return `/uploads/products/${imageName}`;
  };

  // Filtrar y ordenar productos
  const processedProducts = useMemo(() => {
    // Filtrado
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Ordenación
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'rating-desc': return (b.rating || 0) - (a.rating || 0);
        default: return 0;
      }
    });
  }, [products, searchTerm, categoryFilter, sortOption]);

  // Obtener categorías únicas
  const categories = useMemo(() => 
    ['all', ...new Set(products.map(product => product.category))], 
    [products]
  );

  // Renderizar estrellas de rating
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-[#F2A9FD] text-sm" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-[#F2A9FD] text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    
    return stars;
  };

  // Calcular descuento
  const calculateDiscount = (product) => {
    if (!product?.originalPrice || !product?.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  // Toggle favoritos
  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Componente de ProductCard
  const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [localSelectedImage, setLocalSelectedImage] = useState(0);

    const images = [
      getImageUrl(product.image),
      ...(product.additionalImages?.map(img => getImageUrl(img)) || [])
    ];

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

    const handleAddToCart = (e) => {
      e.preventDefault();
      addToCart(product, quantity);
      setIsAdded(true);
      
      toast.success(
        <div className="flex items-center">
          <FaShoppingCart className="text-[#0C4B45] mr-2" />
          <span>{product.name} agregado al carrito</span>
        </div>,
        {
          position: "top-right",
          className: 'bg-white border-l-4 border-[#662D8F] shadow-lg'
        }
      );
    };

    const handleUpdateQuantity = (e, newQuantity) => {
      e.preventDefault();
      if (newQuantity < 1 || newQuantity > (product.stock || 10)) return;
      
      setQuantity(newQuantity);
      if (isAdded) updateQuantity(product._id, newQuantity);
    };

    const isFavorite = favorites.includes(product._id);

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
            {product.isNew && (
              <motion.span 
                className="bg-[#F2A9FD] text-[#0C4B45] text-xs font-bold px-3 py-1 rounded-full shadow-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                NUEVO
              </motion.span>
            )}
            {product.originalPrice && product.price < product.originalPrice && (
              <motion.span 
                className="bg-[#662D8F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                -{calculateDiscount(product)}%
              </motion.span>
            )}
          </div>

          {/* Favorite Button */}
          <motion.button 
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product._id);
            }}
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
          <Link to={`/product/${product._id}`} className="block relative flex-grow">
            <div className="relative h-64 w-full bg-gradient-to-br from-[#0C4B45]/5 to-[#83F4E9]/5">
              <img 
                src={images[localSelectedImage]} 
                alt={product.name}
                className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => e.target.src = '/placeholder.jpg'}
              />

              {/* Navegación de imágenes */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setLocalSelectedImage((prev) => (prev - 1 + images.length) % images.length);
                    }}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white text-[#662D8F]"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setLocalSelectedImage((prev) => (prev + 1) % images.length);
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
                        setQuickViewProduct(product);
                        setSelectedImageIndex(localSelectedImage);
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
            <Link to={`/product/${product._id}`} className="mb-2">
              <h3 className="font-bold text-lg text-[#0C4B45] hover:text-[#662D8F] transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.shortDescription || product.description || 'Descripción no disponible'}
              </p>
            </Link>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex">
                {renderRatingStars(product.rating)}
              </div>
              <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
            </div>

            {/* Precio y stock */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-bold text-xl text-[#662D8F]">
                  ${product.price?.toLocaleString() || '0.00'}
                </span>
                {product.originalPrice && product.price < product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through ml-2">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.stock !== undefined && (
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
                  disabled={quantity >= (product.stock || 10)}
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
      </motion.div>
    );
  };

  // Lógica de paginación
  const totalPages = Math.ceil(totalProducts / productsPerPage);
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
          Cargando nuestra colección premium...
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
          <h2 className="text-xl font-bold text-[#0C4B45] mb-2">Error al cargar productos</h2>
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
    <div className="min-h-screen bg-gradient-to-b from-[#0C4B45]/5 to-[#83F4E9]/5">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#0C4B45]">Colección Premium</h1>
              <p className="text-[#0C4B45]/80 mt-1">Productos de alta calidad seleccionados para ti</p>
            </div>
            
            {/* Barra de búsqueda desktop */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-[#0C4B45]/60" />
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#662D8F] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Mobile filters button */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-xl bg-white shadow-sm text-sm font-medium text-[#0C4B45] hover:bg-gray-50 mb-4"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <FaFilter className="mr-2" />
              Filtros
            </button>

            {/* Desktop filters */}
            <div className="hidden lg:block">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-[#0C4B45] mb-4">Filtrar por</h3>
                
                {/* Categorías */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-[#0C4B45] mb-3">Categorías</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <input
                          id={`category-${category}`}
                          name="category"
                          type="radio"
                          className="h-4 w-4 border-gray-300 rounded text-[#662D8F] focus:ring-[#662D8F]"
                          checked={categoryFilter === category}
                          onChange={() => setCategoryFilter(category)}
                        />
                        <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-700 capitalize">
                          {category === 'all' ? 'Todas las categorías' : category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ordenar */}
                <div>
                  <h4 className="text-sm font-medium text-[#0C4B45] mb-3">Ordenar por</h4>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#662D8F] focus:border-transparent rounded-xl"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="default">Predeterminado</option>
                    <option value="price-asc">Precio: Menor a mayor</option>
                    <option value="price-desc">Precio: Mayor a menor</option>
                    <option value="name-asc">Nombre: A-Z</option>
                    <option value="name-desc">Nombre: Z-A</option>
                    <option value="rating-desc">Mejor valorados</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile filters dialog */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 overflow-y-auto lg:hidden"
              >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={() => setMobileFiltersOpen(false)}></div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="inline-block align-bottom bg-white rounded-t-2xl shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-[#0C4B45]">Filtros</h3>
                        <button
                          type="button"
                          className="-mr-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                          onClick={() => setMobileFiltersOpen(false)}
                        >
                          <FaTimes className="h-6 w-6" />
                        </button>
                      </div>

                      {/* Categorías */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-[#0C4B45] mb-3">Categorías</h4>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <div key={category} className="flex items-center">
                              <input
                                id={`mobile-category-${category}`}
                                name="mobile-category"
                                type="radio"
                                className="h-4 w-4 border-gray-300 rounded text-[#662D8F] focus:ring-[#662D8F]"
                                checked={categoryFilter === category}
                                onChange={() => setCategoryFilter(category)}
                              />
                              <label htmlFor={`mobile-category-${category}`} className="ml-3 text-sm text-gray-700 capitalize">
                                {category === 'all' ? 'Todas las categorías' : category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ordenar */}
                      <div>
                        <h4 className="text-sm font-medium text-[#0C4B45] mb-3">Ordenar por</h4>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#662D8F] focus:border-transparent rounded-xl"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                        >
                          <option value="default">Predeterminado</option>
                          <option value="price-asc">Precio: Menor a mayor</option>
                          <option value="price-desc">Precio: Mayor a menor</option>
                          <option value="name-asc">Nombre: A-Z</option>
                          <option value="name-desc">Nombre: Z-A</option>
                          <option value="rating-desc">Mejor valorados</option>
                        </select>
                      </div>

                      <div className="mt-6">
                        <button
                          type="button"
                          className="w-full py-3 px-6 bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] text-white rounded-xl font-medium hover:from-[#512577] hover:to-[#e895fc] transition-all"
                          onClick={() => setMobileFiltersOpen(false)}
                        >
                          Aplicar filtros
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <div className="flex-1">
            {processedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-[#0C4B45]">No se encontraron productos</h3>
                <p className="mt-2 text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda</p>
                <motion.button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setSortOption('default');
                  }}
                  className="py-2 px-6 border border-transparent rounded-xl text-sm font-medium text-white bg-[#0C4B45] hover:bg-[#083D38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C4B45]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Limpiar filtros
                </motion.button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processedProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Mostrando {(currentPage - 1) * productsPerPage + 1} - {Math.min(currentPage * productsPerPage, totalProducts)} de {totalProducts} productos
                    </div>
                    
                    <div className="flex items-center gap-1">
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
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Vista Rápida */}
      <AnimatePresence>
        {quickViewProduct && (
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
                  <h3 className="text-3xl font-bold text-[#0C4B45]">{quickViewProduct.name}</h3>
                  <motion.button 
                    onClick={() => setQuickViewProduct(null)}
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
                        src={getImageUrl(quickViewProduct.image)} 
                        alt={quickViewProduct.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    
                    {quickViewProduct.additionalImages?.length > 0 && (
                      <div className="grid grid-cols-4 gap-3">
                        {[quickViewProduct.image, ...quickViewProduct.additionalImages].map((img, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            whileHover={{ y: -3 }}
                            className={`border-2 rounded-xl overflow-hidden transition-all ${
                              selectedImageIndex === index 
                                ? 'border-[#662D8F] shadow-md' 
                                : 'border-transparent hover:border-gray-200'
                            }`}
                          >
                            <img 
                              src={getImageUrl(img)} 
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
                              star <= (quickViewProduct.rating || 0) 
                                ? 'text-[#F2A9FD]' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({quickViewProduct.reviewCount || 0} reseñas)
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-8 leading-relaxed">
                      {quickViewProduct.description || 'Descripción no disponible'}
                    </p>
                    
                    <div className="mb-8">
                      <span className="font-bold text-3xl text-[#662D8F]">
                        ${quickViewProduct.price?.toLocaleString() || '0.00'}
                      </span>
                      {quickViewProduct.originalPrice && quickViewProduct.price < quickViewProduct.originalPrice && (
                        <span className="text-lg text-gray-400 line-through ml-3">
                          ${quickViewProduct.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Barra de stock */}
                    {quickViewProduct.stock !== undefined && (
                      <div className="mb-8">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Disponibilidad:</span>
                          <span className={`font-medium ${
                            quickViewProduct.stock > 5 ? 'text-[#0C4B45]' : 'text-[#662D8F]'
                          }`}>
                            {quickViewProduct.stock} unidades disponibles
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-full rounded-full ${
                              quickViewProduct.stock > 5 ? 'bg-[#83F4E9]' : 'bg-[#F2A9FD]'
                            }`} 
                            style={{ 
                              width: `${Math.min(100, (quickViewProduct.stock / 10) * 100)}%`,
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
                          onClick={(e) => {
                            e.preventDefault();
                            const cartItem = cart.find(item => item.product._id === quickViewProduct._id);
                            const currentQty = cartItem ? cartItem.quantity : 1;
                            if (currentQty > 1) {
                              updateQuantity(quickViewProduct._id, currentQty - 1);
                            }
                          }}
                          className="px-4 py-3 hover:bg-gray-100 text-[#662D8F] transition-colors"
                          disabled={cart.find(item => item.product._id === quickViewProduct._id)?.quantity <= 1 || !cart.find(item => item.product._id === quickViewProduct._id)}
                        >
                          <FaMinus />
                        </button>
                        <span className="px-5 py-2 font-medium text-lg w-12 text-center">
                          {cart.find(item => item.product._id === quickViewProduct._id)?.quantity || 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const cartItem = cart.find(item => item.product._id === quickViewProduct._id);
                            const currentQty = cartItem ? cartItem.quantity : 1;
                            if (currentQty < (quickViewProduct.stock || 10)) {
                              if (cartItem) {
                                updateQuantity(quickViewProduct._id, currentQty + 1);
                              } else {
                                addToCart(quickViewProduct, currentQty + 1);
                              }
                            }
                          }}
                          className="px-4 py-3 hover:bg-gray-100 text-[#662D8F] transition-colors"
                          disabled={cart.find(item => item.product._id === quickViewProduct._id)?.quantity >= (quickViewProduct.stock || 10)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex space-x-4">
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          const cartItem = cart.find(item => item.product._id === quickViewProduct._id);
                          if (cartItem) {
                            toast.success(
                              <div className="flex items-center">
                                <FaShoppingCart className="text-[#0C4B45] mr-2" />
                                <span>Producto ya en el carrito</span>
                              </div>,
                              {
                                position: "top-right",
                                className: 'bg-white border-l-4 border-[#662D8F] shadow-lg'
                              }
                            );
                          } else {
                            addToCart(quickViewProduct, cart.find(item => item.product._id === quickViewProduct._id)?.quantity || 1);
                            toast.success(
                              <div className="flex items-center">
                                <FaShoppingCart className="text-[#0C4B45] mr-2" />
                                <span>{quickViewProduct.name} agregado al carrito</span>
                              </div>,
                              {
                                position: "top-right",
                                className: 'bg-white border-l-4 border-[#662D8F] shadow-lg'
                              }
                            );
                          }
                          setQuickViewProduct(null);
                        }}
                        className={`flex-1 py-4 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                          cart.find(item => item.product._id === quickViewProduct._id) 
                            ? 'bg-[#83F4E9] text-[#0C4B45]' 
                            : 'bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] text-white'
                        }`}
                        whileHover={!cart.find(item => item.product._id === quickViewProduct._id) ? { 
                          scale: 1.02,
                          boxShadow: '0 5px 20px rgba(102, 45, 143, 0.4)'
                        } : {}}
                        whileTap={!cart.find(item => item.product._id === quickViewProduct._id) ? { scale: 0.98 } : {}}
                      >
                        <span className="relative z-10 flex items-center text-lg font-medium">
                          {cart.find(item => item.product._id === quickViewProduct._id) ? (
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
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(quickViewProduct._id);
                        }}
                        className={`p-4 rounded-xl flex items-center justify-center text-xl ${
                          favorites.includes(quickViewProduct._id) 
                            ? 'bg-[#F2A9FD]/20 text-[#662D8F]' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {favorites.includes(quickViewProduct._id) ? <FaHeart /> : <FaRegHeart />}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsListPage;