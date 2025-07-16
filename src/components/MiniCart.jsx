import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiX, FiTrash2 } from 'react-icons/fi';
import './MiniCart.css';

const MiniCart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalCost } = useCart();
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();

  // Auto-close after 4s when open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setClosing(true);
        setTimeout(() => {
          setClosing(false);
          onClose();
        }, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || cart.length === 0) return null;

  return (
    <div className={`mini-cart ${isOpen ? 'open' : ''} ${closing ? 'closing' : ''}`}>
      <div className="mini-cart-header">
        <h3>Your Cart</h3>
        <button className="close-btn" onClick={() => {
          setClosing(true);
          setTimeout(() => {
            setClosing(false);
            onClose();
          }, 300);
        }}>
          <FiX />
        </button>
      </div>

      <div className="mini-cart-content">
        {cart.map((item) => (
          <div className="cart-item" key={item._id}>
            <img src={item.photoUrls?.[0]} alt={item.name} />
            <div className="item-info">
              <h4>{item.name}</h4>
              <p>Ksh {item.price.toLocaleString()}</p>
              <div className="qty-controls">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                />
                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mini-cart-footer">
        <p>Total: Ksh {totalCost.toLocaleString()}</p>
        <button
          className="checkout-btn"
          onClick={() => {
            onClose();
            navigate('/cart');
          }}
        >
          Go to Cart
        </button>
      </div>
    </div>
  );
};

export default MiniCart;
