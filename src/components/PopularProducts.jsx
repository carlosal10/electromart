// src/components/PopularProducts.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiTruck, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import './PopularProducts.css';

const PopularProducts = ({ limit = 8 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`https://ecommerce-electronics-0j4e.onrender.com/api/products?popular=true&limit=${limit}`)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [limit]);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    if (!product.inStock) {
      toast.warn('Sorry, this product is out of stock.');
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section className="popularProducts">
      <h2 className="heading">Possibly You May Be Interested</h2>

      <div className="productGrid">
        {loading
          ? [...Array(limit)].map((_, i) => (
            <div key={i} className="card skeleton" />
          ))
          : products.map(product => (
            <div
              key={product._id}
              className={`card ${!product.inStock ? 'disabled' : ''}`}
              onClick={() => handleCardClick(product._id)}
            >
              <div className="imageWrapper">
                <img
                  src={product.photoUrls?.[0]}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => { e.target.src = '/images/fallback.jpg'; }}
                />
              </div>

              <div className="cardBody">
                <h3>{product.name}</h3>
                <p className="code">Code: {product._id.slice(-6)}</p>

                <p className="price">
                  Ksh {product.price.toLocaleString()}
                  {product.discount && product.originalPrice && (
                    <span className="original">
                      <s>Ksh {product.originalPrice.toLocaleString()}</s>
                    </span>
                  )}
                </p>

                {product.discount && (
                  <span className="discount">Save {product.discount}%</span>
                )}

                <p className={`stock ${product.inStock ? 'inStock' : 'outOfStock'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </p>

                <p className="rating">
                  <FiStar /> {product.rating || 4.5} ({product.reviewsCount || 12} reviews)
                </p>

                {product.freeShipping && (
                  <p className="shipping">
                    <FiTruck /> Free Shipping
                  </p>
                )}

                <button
                  className="cartBtn"
                  disabled={!product.inStock}
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <FiShoppingCart style={{ marginRight: '8px' }} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="viewAll">
        <Link to="/products/popular" className="viewAllBtn">
          View All Popular
        </Link>
      </div>
    </section>
  );
};

export default PopularProducts;
