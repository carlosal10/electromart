import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import DynamicProductCard from './ProductCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CenterCarousel.css"

const ShowcaseCenter = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://ecommerce-electronics-0j4e.onrender.com/api/products?featured=true&limit=5').then(res => setProducts(res.data));
  }, []);

  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    infinite: true,
    pauseOnHover: true,
    arrows: false,
    dots: true,
  };

  return (
    <div className="showcase-wrapper">
  <div className="showcase-carousel">
    <Slider {...settings}>
      {products.map(p => (
        <div key={p._id}>
          <DynamicProductCard product={p} />
        </div>
      ))}
    </Slider>
  </div>

  {banner && (
    <div className="banner-container">
      <h4 className="banner-title">{banner.title}</h4>
      <p className="banner-subtitle">{banner.subtitle}</p>
      <button className="banner-button">{banner.buttonText}</button>
    </div>
  )}
</div>
  );
};

export default ShowcaseCenter;
