// src/admin/ProductCreate.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';

const ProductCreate = () => {
  const navigate = useNavigate();

  const handleProductSubmit = (createdProduct) => {
    console.log('Producto creado:', createdProduct);
    navigate('/admin/products'); // redirige después de guardar
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Crear nuevo producto</h2>
      <ProductForm onSubmit={handleProductSubmit} />
    </div>
  );
};

export default ProductCreate;
