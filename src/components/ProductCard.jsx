import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Defensive check — helps avoid silent failures
  if (!product || typeof product !== 'object') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Invalid product passed to DynamicProductCard:', product);
    }
    return null;
  }

  const {
    _id,
    name = 'Unnamed Product',
    price = 0,
    discountedPrice,
    photoUrls = [],
    freeShipping = false,
  } = product;

  // Safer image URL fallback
  const imageUrl =
    (photoUrls?.[0] && photoUrls[0].startsWith('http') ? photoUrls[0] : null) ||
    'https://via.placeholder.com/300x300?text=No+Image';

  const handleCardClick = () => {
    if (_id) navigate(`/product/${_id}`);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    // Add to cart logic goes here
  };

  return (
    <div className="product-card group" onClick={handleCardClick}>
      <img src={imageUrl} alt={name} className="product-image" />

      <div className="product-info">
        <h4 className="product-title">{name}</h4>

        <p className="product-price">
          {discountedPrice ? (
            <>
              <span className="discounted-price">${discountedPrice}</span>{' '}
              <span className="original-price">${price}</span>
            </>
          ) : (
            <span className="regular-price">${price}</span>
          )}
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

export default ProductCard;
