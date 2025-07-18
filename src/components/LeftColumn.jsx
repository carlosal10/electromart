import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DynamicProductCard from './ProductCard';
import './LeftColumn.css'; // <-- link to styles

const ShowcaseLeft = () => {
  const [banner, setBanner] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://ecommerce-electronics-0j4e.onrender.com/api/hero?section=showcase-left')
      .then(res => setBanner(res.data));
    axios.get('https://ecommerce-electronics-0j4e.onrender.com/api/products?limit=2')
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div className="showcase-left-wrapper">
      {banner && (
        <div
          className="showcase-banner"
          style={{ backgroundImage: `url(${banner.imageUrl})` }}
        >
          <div className="banner-overlay">
            <h3 className="banner-title">{banner.title}</h3>
            <p className="banner-subtitle">{banner.subtitle}</p>
            <button className="banner-button">{banner.buttonText}</button>
          </div>
        </div>
      )}
      {products.map((p) => (
        <DynamicProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default ShowcaseLeft;
