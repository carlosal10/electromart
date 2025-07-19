import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import './ProductCard.css';

const DynamicProductCard = ({ product }) => {
  const navigate = useNavigate();
  if (!product || typeof product !== 'object') return null;

  const {
    _id,
    name = 'Unnamed Product',
    price,
    discountedPrice,
    photoUrls = [],
    freeShipping = false,
  } = product;

  const imageUrl = photoUrls[0] || 'https://via.placeholder.com/300x300?text=No+Image';

  const handleCardClick = () => {
    if (_id) navigate(`/product/${_id}`);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    // dispatch(addToCart(product));
  };

  return (
    <div className="product-card group" onClick={handleCardClick}>
      <img
        src={imageUrl}
        alt={name}
        className="product-image"
      />

      <div className="product-info">
        <h4 className="product-title">{name}</h4>
        <p className="product-price">
          ${discountedPrice || price || '0.00'}
        </p>
        <div className="product-rating">★★★★☆</div>

        {freeShipping && (
          <span className="free-shipping-badge">Free Shipping</span>
        )}
      </div>

      <button className="cart-button" onClick={handleCartClick}>
        <FiShoppingCart />
      </button>
    </div>
  );
};

export default DynamicProductCard;
