import React, { useEffect, useState } from 'react';
import styles from './PopularProducts.css';

const PopularProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/popularProducts')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to load popular products', err));
  }, []);

  return (
    <section className={styles.popularProducts}>
      <h2 className={styles.heading}>Possibly You May Be Interested</h2>
      <div className={styles.productGrid}>
        {products.map(product => (
          <div key={product.code} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={product.imageUrl} alt={product.name} />
            </div>

            <div className={styles.cardBody}>
              <h3>{product.name}</h3>
              <p className={styles.code}>Code: {product.code}</p>

              <p className={styles.price}>
                Ksh {product.price.toLocaleString()}
                {product.discount && product.originalPrice && (
                  <span className={styles.discount}>
                    (was Ksh {product.originalPrice.toLocaleString()}, save {product.discount}%)
                  </span>
                )}
              </p>

              <p className={styles.stock + ' ' + (product.stockStatus === 'In Stock' ? styles.inStock : styles.outOfStock)}>
                {product.stockStatus}
              </p>

              <p className={styles.rating}>
                ⭐ {product.rating} <span>({product.reviewsCount} reviews)</span>
              </p>

              {product.freeShipping && <span className={styles.shipping}>🚚 Free Shipping</span>}

              <button className={styles.cartBtn}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularProducts;
