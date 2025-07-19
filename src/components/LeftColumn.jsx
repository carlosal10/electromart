import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DynamicProductCard from './ProductCard';
import './LeftColumn.css';

const ShowcaseLeft = () => {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://ecommerce-electronics-0j4e.onrender.com/api/showcase/left')
      .then(res => {
        if (res.data) {
          setBanners(res.data.banners || []);
          setProducts(res.data.products || []);
        }
      })
      .catch(err => console.error("Showcase left fetch failed:", err));
  }, []);

  const productTop = products.find(p => p.position === 'top');
  const productBottom = products.find(p => p.position === 'bottom');

  return (
    <div className="showcase-left-wrapper">
      {/* Top Banner (first only) */}
      {banners.length > 0 && banners[0]?.photoUrl && (
        <div
          className="showcase-banner"
          style={{ backgroundImage: `url(${banners[0].photoUrl})` }}
        >
          <div className="banner-overlay">
            <h3 className="banner-title">{banners[0].title}</h3>
            <p className="banner-subtitle">{banners[0].subtitle}</p>
            {banners[0].buttonText && (
              <button className="banner-button">
                {banners[0].buttonText}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Product */}
      {productTop && (
        <DynamicProductCard key={productTop._id} product={productTop} />
      )}

      {/* Bottom Product */}
      {productBottom && (
        <DynamicProductCard key={productBottom._id} product={productBottom} />
      )}
    </div>
  );
};

export default ShowcaseLeft;
