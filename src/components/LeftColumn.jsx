import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './LeftColumn.css';

const LeftColumn = () => {
  const [leftProducts, setLeftProducts] = useState([]);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchLeftProducts = async () => {
      try {
        const res = await axios.get('/api/products?limit=2');
        setLeftProducts(res.data.slice(0, 2));
      } catch (err) {
        console.error('Error fetching left column products:', err);
      }
    };

    const fetchBanners = async () => {
      try {
        const res = await axios.get('/api/banners?position=left');
        setBanners(res.data);
      } catch (err) {
        console.error('Error fetching left column banners:', err);
      }
    };

    fetchLeftProducts();
    fetchBanners();
  }, []);

  return (
    <div className="left-column">
      <div className="top-banners">
        {banners.slice(0, 3).map(banner => (
          <img
            key={banner._id}
            src={banner.posterUrl}
            alt={banner.title}
            className="banner-image"
          />
        ))}
      </div>

      {leftProducts[0] && (
        <div className="middle-product">
          <ProductCard product={leftProducts[0]} />
        </div>
      )}

      {leftProducts[1] && (
        <div className="bottom-product">
          <ProductCard product={leftProducts[1]} />
        </div>
      )}
    </div>
  );
};

export default LeftColumn;
