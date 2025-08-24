import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiImage,
  FiDollarSign,
  FiPackage,
  FiAlertCircle,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [currentProductImages, setCurrentProductImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products');
        
        if (response.data?.success) {
          const productsWithImages = response.data.data.map(product => ({
            ...product,
            allImages: [
              product.image ? getImageUrl(product.image) : '/placeholder.jpg',
              ...(product.additionalImages?.map(img => getImageUrl(img)) || [])
            ]
          }));
          setProducts(productsWithImages);
          setError(null);
        } else {
          throw new Error('Formato de respuesta inesperado');
        }
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setError('Hubo un error al cargar los productos. Por favor intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `/uploads/products/${imagePath}`;
  };

  const handleAddProduct = () => {
    navigate('/admin/products/new');
  };

  const handleEditProduct = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar este producto permanentemente?')) return;
    
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
      toast.success('Producto eliminado correctamente', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        className: "bg-white border-l-4 border-[#662D8F] shadow-lg"
      });
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      toast.error('No se pudo eliminar el producto', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        className: "bg-white border-l-4 border-red-500 shadow-lg"
      });
    }
  };

  const openImageGallery = (images, index = 0) => {
    setCurrentProductImages(images);
    setSelectedImageIndex(index);
    setShowFullscreenImage(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      (prev + 1) % currentProductImages.length
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      (prev - 1 + currentProductImages.length) % currentProductImages.length
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0C4B45]/5 to-white p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-[#0C4B45]"
        >
          <FiLoader size={48} />
        </motion.div>
        <p className="mt-4 text-xl font-medium text-[#0C4B45]">Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0C4B45]/5 to-white p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <FiAlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-[#0C4B45] mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#0C4B45] to-[#083D38] text-white rounded-lg hover:from-[#083D38] hover:to-[#0C4B45] transition-all shadow-md"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C4B45]/5 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0C4B45] mb-2">Gestión de Productos</h1>
            <p className="text-gray-600">Administra todos los productos disponibles en tu tienda</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddProduct}
            className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-gradient-to-r from-[#662D8F] to-[#512577] text-white rounded-lg hover:from-[#512577] hover:to-[#662D8F] transition-all shadow-lg"
          >
            <FiPlus className="mr-2" size={20} />
            Nuevo Producto
          </motion.button>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image Gallery */}
                  <div className="relative h-48 bg-gradient-to-br from-[#0C4B45]/10 to-[#83F4E9]/10">
                    {product.allImages.length > 0 ? (
                      <>
                        <img
                          src={product.allImages[0]}
                          alt={product.name}
                          className="w-full h-full object-contain cursor-pointer p-4"
                          onClick={() => openImageGallery(product.allImages, 0)}
                        />
                        {product.allImages.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1 shadow-sm">
                            <span className="text-xs font-medium text-[#662D8F] px-2">
                              +{product.allImages.length - 1}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openImageGallery(product.allImages, 0);
                          }}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                        >
                          <FiZoomIn className="text-[#662D8F]" size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiImage size={48} />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="font-semibold text-[#0C4B45] truncate"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center text-[#662D8F] font-bold">
                        <FiDollarSign className="mr-1" size={14} />
                        <span>{product.price?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-12">
                      {product.description || 'Sin descripción'}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                      </span>

                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditProduct(product._id)}
                          className="text-[#0C4B45] hover:text-[#083D38] p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FiEdit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-[#0C4B45] mb-2">No hay productos registrados</h3>
            <p className="text-gray-600 mb-6">Comienza agregando tu primer producto</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddProduct}
              className="px-6 py-3 bg-gradient-to-r from-[#662D8F] to-[#512577] text-white rounded-lg hover:from-[#512577] hover:to-[#662D8F] transition-all shadow-md"
            >
              <FiPlus className="inline mr-2" />
              Agregar Producto
            </motion.button>
          </div>
        )}
      </div>

      {/* Fullscreen Image Gallery */}
      <AnimatePresence>
        {showFullscreenImage && (
          <motion.div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative max-w-6xl w-full max-h-[90vh]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setShowFullscreenImage(false)}
                className="absolute top-4 right-4 text-white text-3xl z-10 hover:text-[#F2A9FD]"
              >
                &times;
              </button>
              
              <div className="relative h-full w-full flex items-center justify-center">
                <img
                  src={currentProductImages[selectedImageIndex]}
                  alt="Producto"
                  className="max-h-full max-w-full object-contain"
                />
                
                {currentProductImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full text-white"
                    >
                      <FiChevronLeft className="text-xl" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full text-white"
                    >
                      <FiChevronRight className="text-xl" />
                    </button>
                    
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
                      {currentProductImages.map((_, index) => (
                        <button 
                          key={index}
                          onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(index); }}
                          className={`w-3 h-3 rounded-full transition-all ${
                            selectedImageIndex === index 
                              ? 'bg-white scale-125' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
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

export default ProductList;