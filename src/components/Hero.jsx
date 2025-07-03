import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <section className="hero">
    <div className="hero-content">
      <h1>Upgrade Your Tech</h1>
      <p>Best deals on the latest electronics</p>
      <Link to="/shop" className="cta-btn">Shop Now</Link>
    </div>
  </section>
);

export default Hero;
