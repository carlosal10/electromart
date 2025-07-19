import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductCarousel.css';
import ProductCard from './ProductCard';

const ProductCarousel = ({ products }) => {
  if (!products?.length) return null;

  return (
    <div className="carousel-container">
      {products.map((product) => (
        <div key={product._id} className="carousel-item">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductCarousel;
