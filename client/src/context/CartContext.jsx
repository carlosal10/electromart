import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderId, setOrderId] = useState(() => {
    const saved = localStorage.getItem('orderId');
    if (saved) return saved;

    const newId = uuidv4();
    localStorage.setItem('orderId', newId);
    return newId;
  });

  const [isMiniCartOpen, setMiniCartOpen] = useState(false);
  const [autoCloseMiniCart, setAutoCloseMiniCart] = useState(true);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Auto-close mini cart after delay
  useEffect(() => {
    if (isMiniCartOpen && autoCloseMiniCart) {
      const timer = setTimeout(() => setMiniCartOpen(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isMiniCartOpen, autoCloseMiniCart]);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });

    // Open mini cart with animation
    setMiniCartOpen(true);
  };

  const updateQuantity = (id, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    const newId = uuidv4();
    setOrderId(newId);
    localStorage.setItem('orderId', newId);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalCost,
        orderId,
        isMiniCartOpen,
        setMiniCartOpen,
        autoCloseMiniCart,
        setAutoCloseMiniCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
