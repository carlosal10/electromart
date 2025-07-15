// src/components/PopularProducts.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PopularProducts.module.css';

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
    <section className={styles.popularProducts}>
      <h2 className={styles.heading}>Possibly You May Be Interested</h2>

      {loading ? (
        <div className={styles.productGrid}>
          {[...Array(limit)].map((_, i) => (
            <div key={i} className={`${styles.card} ${styles.skeleton}`} />
          ))}
        </div>
      ) : (
        <div className={styles.productGrid}>
          {products.map(product => (
            <div key={product._id} className={styles.card}>
              <img src={product.photoUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Code: {product.code}</p>
              <p>
                Ksh {product.price.toLocaleString()}
                {product.discount && (
                  <span className={styles.discount}>
                    &nbsp;(was {product.originalPrice.toLocaleString()}, save {product.discount}%)
                  </span>
                )}
              </p>
              <p>Status: {product.stockStatus}</p>
              <p>Rating: ⭐ {product.rating} ({product.reviewsCount} reviews)</p>
              {product.freeShipping && <p className={styles.shipping}>🚚 Free Shipping</p>}
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.viewAll}>
        <Link to="/products/popular" className={styles.viewAllBtn}>
          View All Popular
        </Link>
      </div>
    </section>
  );
};

export default PopularProducts;
