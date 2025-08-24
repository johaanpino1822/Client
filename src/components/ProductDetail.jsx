import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validación básica del ID (asumiendo MongoDB)
        if (!id || id.length !== 24) {
          throw new Error('ID de producto inválido');
        }

        const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
          timeout: 5000 // Timeout de 5 segundos
        });

        if (!res.data) {
          throw new Error('No se recibieron datos del producto');
        }

        setProduct(res.data);
      } catch (err) {
        console.error('Error al obtener el producto:', err);
        setError(err.response?.data?.message || err.message || 'Error desconocido');
        
        // Redirigir a página principal si el producto no existe
        if (err.response?.status === 404) {
          setTimeout(() => navigate('/'), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          {error.includes('no encontrado') && (
            <p>Serás redirigido a la página principal...</p>
          )}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p>El producto no está disponible</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Imagen del producto */}
          <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 md:h-96 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23ccc"><rect width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-family="sans-serif" font-size="12">Imagen no disponible</text></svg>';
                }}
              />
            ) : (
              <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center text-gray-500">
                Imagen no disponible
              </div>
            )}
          </div>

          {/* Detalles del producto */}
          <div className="p-6 md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            
            <p className="text-lg font-semibold text-blue-600 mb-4">
              ${product.price.toLocaleString()}
            </p>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-1">Descripción</h2>
              <p className="text-gray-600">{product.description || 'No hay descripción disponible'}</p>
            </div>
            
            {product.location && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-1">Ubicación</h2>
                <p className="text-gray-600">{product.location}</p>
              </div>
            )}
            
            {/* Puedes agregar más campos aquí según tu modelo de producto */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate(-1)}
              >
                Volver atrás
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;