// src/components/PopularProducts.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PopularProducts.css'; // ✅ Correct way, not `styles = from`

const PopularProducts = ({ limit = 8 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://ecommerce-electronics-0j4e.onrender.com/api/products?popular=true&limit=${limit}`)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <section className="popularProducts">
      <h2 className="heading">Possibly You May Be Interested</h2>

      <div className="productGrid">
        {loading
          ? [...Array(limit)].map((_, i) => (
              <div key={i} className="card skeleton" />
            ))
          : products.map(product => (
              <div key={product._id} className="card">
                <div className="imageWrapper">
                  <img
                    src={product.photoUrls?.[0]}
                    alt={product.name}
                    loading="lazy"
                  />
                </div>
                <div className="cardBody">
                  <h3>{product.name}</h3>
                  <p className="code">Code: {product._id.slice(-6)}</p>
                  <p className="price">
                    Ksh {product.price.toLocaleString()}
                  </p>
                  {product.discount && product.originalPrice && (
                    <span className="discount">
                      (was Ksh {product.originalPrice.toLocaleString()}, save {product.discount}%)
                    </span>
                  )}
                  <p className={`stock ${product.inStock ? 'inStock' : 'outOfStock'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                  <p className="rating">
                    ⭐ {product.rating || 4.5} ({product.reviewsCount || 12} reviews)
                  </p>
                  {product.freeShipping && (
                    <p className="shipping">🚚 Free Shipping</p>
                  )}
                  <button className="cartBtn">Add to Cart</button>
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
