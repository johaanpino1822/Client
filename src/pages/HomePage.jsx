import React, { useEffect, useState, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import HeroWelcome from "../components/HeroWelcome";
import Footer from "../components/Footer";
import api from '../api/axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderReady, setSliderReady] = useState(false);

  // Obtener la URL base de la API desde las variables de entorno
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  // Función para obtener productos con manejo de errores
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar la URL base correcta para la API
      const res = await api.get('/api/products', {
      baseURL: API_BASE_URL
      });

      const data = res.data;

      if (!data || !Array.isArray(data.data)) {
        throw new Error('Formato de datos inválido');
      }

      setProducts(data.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setError(err.message || 'Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
      // Pequeño retraso para asegurar que el DOM esté listo
      setTimeout(() => setSliderReady(true), 100);
    }
  }, [API_BASE_URL]); // Agregar API_BASE_URL como dependencia

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Componentes personalizados para flechas con mejor accesibilidad
  const NextArrow = React.memo(({ onClick, currentSlide, slideCount }) => (
    <motion.button 
      onClick={onClick}
      disabled={currentSlide === slideCount - 1}
      className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 transform bg-[#83F4E9]/90 hover:bg-[#83F4E9] text-[#0C4B45] rounded-full p-2 shadow-lg ${
        currentSlide === slideCount - 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      whileHover={{ scale: currentSlide !== slideCount - 1 ? 1.1 : 1 }}
      whileTap={{ scale: currentSlide !== slideCount - 1 ? 0.9 : 1 }}
      aria-label="Siguiente producto"
    >
      <FiChevronRight size={24} />
    </motion.button>
  ));

  const PrevArrow = React.memo(({ onClick, currentSlide }) => (
    <motion.button 
      onClick={onClick}
      disabled={currentSlide === 0}
      className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 transform bg-[#83F4E9]/90 hover:bg-[#83F4E9] text-[#0C4B45] rounded-full p-2 shadow-lg ${
        currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      whileHover={{ scale: currentSlide !== 0 ? 1.1 : 1 }}
      whileTap={{ scale: currentSlide !== 0 ? 0.9 : 1 }}
      aria-label="Producto anterior"
    >
      <FiChevronLeft size={24} />
    </motion.button>
  ));

  // Configuración optimizada del carrusel
  const sliderSettings = {
    dots: true,
    infinite: false, // Cambiado a false para mejor UX en bordes
    speed: 600, // Velocidad reducida para mejor percepción
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
    pauseOnFocus: true,
    pauseOnDotsHover: true,
    initialSlide: 0,
    lazyLoad: 'ondemand',
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
          dots: true
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true
        }
      }
    ],
    appendDots: dots => (
      <div className="bg-transparent rounded-lg p-2">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div 
        className="w-3 h-3 rounded-full bg-[#83F4E9]/50 hover:bg-[#0C4B45] transition-colors duration-300"
        aria-label={`Ir al producto ${i + 1}`}
      />
    )
  };

  if (loading) return (
    <motion.div 
      className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0C4B45]/10 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] mb-4"></div>
        <span className="text-[#0C4B45] font-medium">Cargando productos...</span>
      </motion.div>
    </motion.div>
  );

  if (error) return (
    <div className="text-center py-20 bg-gradient-to-b from-[#0C4B45]/10 to-white">
      <motion.div 
        className="inline-block bg-white p-6 rounded-xl shadow-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-xl font-bold text-[#662D8F] mb-2">Error al cargar productos</h3>
        <p className="text-[#0C4B45]">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-[#662D8F] text-white rounded-lg hover:bg-[#512577] transition-colors"
          onClick={fetchProducts}
          aria-label="Reintentar carga de productos"
        >
          Reintentar
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="home-page bg-gradient-to-b from-[#83F4E9]/10 to-white">
      <HeroWelcome />

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-[#0C4B45]">
            Nuestros <span className="text-[#662D8F]">Productos</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] mx-auto mb-4"></div>
          <p className="text-[#0C4B45]/80 max-w-2xl mx-auto">
            Descubre nuestra exclusiva colección cuidadosamente seleccionada
          </p>
        </motion.div>

        <motion.div 
          className="relative group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {products.length > 0 ? (
            <div className="relative">
              {sliderReady && (
                <Slider {...sliderSettings} className="px-2">
                  {products.map((product) => (
                    <div key={product._id} className="px-3 py-6 focus:outline-none">
                      <motion.div 
                        className="bg-white rounded-xl shadow-lg overflow-hidden h-full border border-[#83F4E9]/20"
                        whileHover={{ 
                          y: -10,
                          boxShadow: "0 20px 25px -5px rgba(102, 45, 143, 0.1), 0 10px 10px -5px rgba(102, 45, 143, 0.04)"
                        }}
                        transition={{ duration: 0.3 }}
                        tabIndex="0"
                        aria-label={`Producto: ${product.name}`}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12 bg-white rounded-xl shadow-sm max-w-md mx-auto"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <p className="text-[#0C4B45]/70 text-lg">No hay productos disponibles</p>
              <button 
                className="mt-4 px-4 py-2 bg-gradient-to-r from-[#662D8F] to-[#F2A9FD] text-white rounded-lg hover:opacity-90 transition-opacity"
                onClick={fetchProducts}
                aria-label="Recargar productos"
              >
                Recargar
              </button>
            </motion.div>
          )}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default React.memo(HomePage);