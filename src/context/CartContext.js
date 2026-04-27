import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await cartAPI.get();
      setCart(res.data.data);
      setCartCount(res.data.data?.totalItems || 0);
    } catch {}
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    await cartAPI.addItem(productId, quantity);
    await fetchCart();
  };

  const removeFromCart = async (cartItemId) => {
    await cartAPI.removeItem(cartItemId);
    await fetchCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await cartAPI.updateItem(cartItemId, quantity);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setCart(null);
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
