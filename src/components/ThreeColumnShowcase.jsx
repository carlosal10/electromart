import React from 'react';
import './ThreeColumnShowcase.css';
import ProductCarousel from './ProductCarousel';
import ProductCard from './ProductCard';
import Banner from './Banner'


const ThreeColumnShowcase = ({ leftBanners = [], rightBanners = [], leftProducts = [], rightProducts = [], centerProducts = [] }) => {
  return (
    <div className="three-column-grid">
      {/* LEFT COLUMN */}
      <div className="column left-column">
        {leftBanners.map((banner) => (
          <Banner key={banner._id} banner={banner} />
        ))}
        {leftProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* CENTER COLUMN */}
      <div className="column center-column">
        <ProductCarousel products={centerProducts} />
      </div>

      {/* RIGHT COLUMN */}
      <div className="column right-column">
        {rightProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {rightBanners.map((banner) => (
          <Banner key={banner._id} banner={banner} />
        ))}
      </div>
    </div>
  );
};

export default ThreeColumnShowcase;