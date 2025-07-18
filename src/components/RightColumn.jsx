import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import DynamicProductCard from './ProductCard';
import './RightColumn.css';

const ShowcaseRight = () => {
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    axios
      .get('https://ecommerce-electronics-0j4e.onrender.com/api/products?tag=deal&limit=3')
      .then(res => setProducts(res.data));

    axios
      .get('https://ecommerce-electronics-0j4e.onrender.com/api/hero?section=midweek')
      .then(res => setBanner(res.data));
  }, []);

  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    swipeToSlide: true,
    infinite: true,
    arrows: false,
    dots: false,
  };

  return (
    <div className="showcase-right-wrapper">
      <div className="showcase-carousel">
        <Slider {...settings}>
          {products.map(product => (
            <div key={product._id} className="carousel-item">
              <DynamicProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>

      {banner && (
        <div className="showcase-banner">
          <h4 className="banner-title">{banner.title}</h4>
          <p className="banner-subtitle">{banner.subtitle}</p>
          <button className="banner-button">{banner.buttonText}</button>
        </div>
      )}
    </div>
  );
};

export default ShowcaseRight;
