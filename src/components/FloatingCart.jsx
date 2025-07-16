// components/FloatingCart.jsx
import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './FloatingCart.css';

const FloatingCart = ({ onClick }) => {
  const { totalItems } = useCart();

  return (
    <div className="floating-cart" onClick={onClick}>
      <FiShoppingCart size={24} />
      {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
    </div>
  );
};

export default FloatingCart;
