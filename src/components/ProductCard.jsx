import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import './ProductCard.css';

const DynamicProductCard = ({ product }) => {
  const navigate = useNavigate();
  if (!product) return null;

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    // dispatch(addToCart(product)) // optional
  };

  return (
    <div className="product-card group" onClick={handleCardClick}>
      <img
        src={product.photoUrls?.[0]}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h4 className="product-title">{product.name}</h4>
        <p className="product-price">
          ${product.discountedPrice || product.price}
        </p>
        <div className="product-rating">★★★★☆</div>
        {product.freeShipping && (
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
