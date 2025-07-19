import React from 'react';
import ProductCarousel from './ProductCarousel';
import "./CenterCarousel.css";

const CenterCarousel = () => {
  return (
    <div className="carousel-wrapper">
      <ProductCarousel title="Top Picks" query="?seasonal=true" autoplay />
    </div>
  );
};

export default CenterCarousel;
