import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import DynamicProductCard from './ProductCard';
import './RightColumn.css';

const ShowcaseRight = () => {
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    // Fetch products tagged "deal"
    axios
      .get('https://ecommerce-electronics-0j4e.onrender.com/api/products?tag=deal&limit=3')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
      });

    // Fetch banner for 'midweek' section
    axios
      .get('https://ecommerce-electronics-0j4e.onrender.com/api/hero?section=midweek')
      .then(res => {
        // Assuming it's an array, pick the first item
        if (Array.isArray(res.data) && res.data.length > 0) {
          setBanner(res.data[0]);
        } else if (res.data && typeof res.data === 'object') {
          setBanner(res.data); // fallback if it's a single object
        } else {
          console.warn('Unexpected banner data format:', res.data);
        }
      })
      .catch(err => {
        console.error('Error fetching banner:', err);
      });
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

      {banner && banner.title && (
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
