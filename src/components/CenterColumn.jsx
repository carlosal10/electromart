import React, { useEffect, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CenterCarousel.css';

const CenterCarousel = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://ecommerce-electronics-0j4e.onrender.com/api/products?featured=true')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch center carousel products:', err));
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    if (!product.inStock) {
      toast.warn('Out of stock');
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="center-carousel-container">
      <div className="carousel-track">
        {products.map(product => (
          <div key={product._id} className="product-card" onClick={() => handleCardClick(product._id)}>
            <div className="img-wrapper">
              <img src={product.photoUrls?.[0]} alt={product.name} loading="lazy" />
            </div>
            <div className="info">
              <h4>{product.name}</h4>
              <p className="code">#{product._id.slice(-5)}</p>
              <p className="price">Ksh {product.price.toLocaleString()}</p>
              {product.discount && (
                <p className="discount">Save {product.discount}%</p>
              )}
              <p className={`stock ${product.inStock ? 'in' : 'out'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
              <button
                className="cart-btn"
                onClick={(e) => handleAddToCart(e, product)}
                disabled={!product.inStock}
              >
                <FiShoppingCart />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CenterCarousel;
