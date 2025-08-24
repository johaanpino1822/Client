import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  });

  // Persistencia en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Añadir al carrito con verificación de stock
  const addToCart = useCallback((product, quantity = 1) => {
    if (!product?._id) return;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product._id === product._id);
      
      if (existingIndex >= 0) {
        const newCart = [...prev];
        const newQuantity = newCart[existingIndex].quantity + quantity;
        
        // Verificar stock máximo (si existe)
        if (product.stock && newQuantity > product.stock) {
          console.warn(`No hay suficiente stock. Máximo disponible: ${product.stock}`);
          return prev;
        }
        
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newQuantity
        };
        return newCart;
      }
      
      // Verificar stock para nuevos items
      if (product.stock && quantity > product.stock) {
        console.warn(`No hay suficiente stock. Máximo disponible: ${product.stock}`);
        return prev;
      }
      
      return [...prev, { product, quantity }];
    });
  }, []);

  // Eliminar del carrito
  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  }, []);

  // Actualizar cantidad con validación
  const updateCartItem = useCallback((productId, { quantity }) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product._id === productId) {
          // Verificar stock máximo si existe
          if (item.product.stock && quantity > item.product.stock) {
            console.warn(`No hay suficiente stock. Máximo disponible: ${item.product.stock}`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  // Limpiar carrito
  const clearCart = useCallback(() => setCart([]), []);

  // Formato compatible con CartPage
  const cartItems = cart.map(item => ({
    ...item.product,
    quantity: item.quantity,
    _id: item.product._id,
    // Asegurar que todos los campos necesarios estén presentes
    name: item.product.name || 'Producto sin nombre',
    price: item.product.price || 0,
    image: item.product.image || '/placeholder-product.jpg'
  }));

  // Calcular subtotal
  const subtotal = cart.reduce((sum, item) => {
    return sum + ((item.product.price || 0) * item.quantity);
  }, 0);

  // Calcular cantidad total de items
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Verificar si un producto está en el carrito
  const isInCart = useCallback((productId) => {
    return cart.some(item => item.product._id === productId);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        subtotal,
        itemCount,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};