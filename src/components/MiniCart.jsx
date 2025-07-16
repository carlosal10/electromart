// components/MiniCart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { FiX, FiTrash2 } from 'react-icons/fi';
import './MiniCart.css';

const MiniCart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalCost } = useCart();

  return (
    <div className={`mini-cart ${isOpen ? 'open' : ''}`}>
      <div className="mini-cart-header">
        <h4>Your Cart</h4>
        <button onClick={onClose}><FiX size={20} /></button>
      </div>

      {cart.length === 0 ? (
        <p className="empty-msg">Your cart is empty.</p>
      ) : (
        <div className="mini-cart-content">
          {cart.map(item => (
            <div className="mini-cart-item" key={item._id}>
              <img src={item.photoUrls?.[0]} alt={item.name} />
              <div className="info">
                <h5>{item.name}</h5>
                <p>Ksh {item.price.toLocaleString()}</p>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                />
              </div>
              <button onClick={() => removeFromCart(item._id)}><FiTrash2 /></button>
            </div>
          ))}

          <div className="mini-cart-footer">
            <strong>Total: Ksh {totalCost.toLocaleString()}</strong>
            <button className="checkout-btn" onClick={() => window.location.href = '/cart'}>Go to Cart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
