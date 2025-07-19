import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductCarousel.css';
import ProductCard from './ProductCard';

const ProductCarousel = ({ title, query, autoplay }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`https://ecommerce-electronics-0j4e.onrender.com/api/products${query}`).then(res => setProducts(res.data));
  }, [query]);

  return (
    <div className="product-carousel">
      <h3 className="carousel-title">{title}</h3>
      <div className={`carousel-track ${autoplay ? 'autoplay' : ''}`}>
        {products.map(product => (
          <ProductCard key={product._id} data={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
