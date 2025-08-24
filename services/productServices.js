// src/services/productService.js
import { API_CONFIG } from '../constants/api';

export const productService = {
  // Obtener todos los productos
  getProducts: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/products`);
      if (!response.ok) throw new Error('Error fetching products');
      return await response.json();
    } catch (error) {
      console.error('Error in productService.getProducts:', error);
      throw error;
    }
  },

  // Obtener producto por ID
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Error fetching product');
      return await response.json();
    } catch (error) {
      console.error('Error in productService.getProductById:', error);
      throw error;
    }
  }
};