import React from 'react';
import { Link } from 'react-router-dom'; // ✅ import Link
import './styles.css';

const Home = () => {
  return (
   <> <section className="hero">
      <div className="hero-content">
        <h1>Upgrade Your Tech</h1>
        <p>Best deals on the latest electronics</p>
        <Link to="/shop" className="cta-btn">Shop Now</Link>
      </div>
    </section>

    <section className="products">
    <h2>Featured Products</h2>
    <div className="product-grid">
      <div className="product-card">Product 1</div>
      <div className="product-card">Product 2</div>
      <div className="product-card">Product 3</div>
    </div>
  </section>
  </>
  );
};

export default Home;
