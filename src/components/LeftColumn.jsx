import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LeftColumn.css';

const LeftColumn = () => {
  const [data, setData] = useState({ banners: [], products: [] });

  useEffect(() => {
    axios.get('https://ecommerce-electronics-0j4e.onrender.com/api/showcase/left')
      .then(res => setData(res.data))
      .catch(err => console.error('Error fetching left column data:', err));
  }, []);

  return (
    <div className="left-column">
      {data.banners.slice(0, 3).map((banner, i) => (
        <div className="banner-card" key={i}>
          <img src={banner.image} alt={banner.title} className="banner-img" />
          <div className="banner-text">
            <h4>{banner.title}</h4>
            <p>{banner.subtitle}</p>
            <p>{banner.description}</p>
          </div>
        </div>
      ))}

      {data.products.map((product, i) => (
        <div className="product-card" key={product._id}>
          <div className="product-img-container">
            <img src={product.images?.[0]} alt={product.name} className="product-img" />
            <button className="add-to-cart">🛒</button>
          </div>
          <div className="product-details">
            <h5>{product.name}</h5>
            <p className="price">KES {product.price?.toLocaleString()}</p>
            <p className={product.inStock ? 'in-stock' : 'out-of-stock'}>
              {product.inStock ? 'In stock' : 'Out of stock'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeftColumn;
