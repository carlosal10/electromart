import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import DynamicProductCard from './ProductCard';
import './RightColumn.css';

const ShowcaseRight = () => {
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    // Fetch seasonal products
    axios
      .get('https://ecommerce-electronics-0j4e.onrender.com/api/products?type=seasonal&limit=3')
      .then(res => {
        setProducts(res.data || []);
      })
      .catch(err => {
        console.error('Error fetching seasonal products:', err);
      });

    // Fetch seasonal banners
    axios
      .get('https://ecommerce-electronics-0j4e.onrender.com/api/hero')
      .then(res => {
        let banners = Array.isArray(res.data) ? res.data : [res.data];
        const seasonalBanner = banners.find(item => item.type === 'seasonal');
        if (seasonalBanner) {
          setBanner(seasonalBanner);
        }
      })
      .catch(err => {
        console.error('Error fetching hero banners:', err);
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
      {/* Seasonal Product Carousel */}
      {products.length > 0 && (
        <div className="showcase-carousel">
          <Slider {...settings}>
            {products.map(product => (
              <div key={product._id} className="carousel-item">
                <DynamicProductCard product={product} />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Seasonal Banner */}
      {banner && banner.title && (
        <div className="showcase-banner">
          <h4 className="banner-title">{banner.title}</h4>
          <p className="banner-subtitle">{banner.subtitle}</p>
          <button
            className="banner-button"
            onClick={() => window.location.href = banner.buttonLink}
          >
            {banner.buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowcaseRight;
