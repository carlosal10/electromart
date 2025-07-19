import React from 'react';
import Slider from 'react-slick';
import ProductCard from './ProductCard';
import './CenterCarousel.css';

const CenterCarousel = ({ products = [] }) => {
  if (!products.length) return null;

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3500,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="center-carousel-wrapper">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product._id} className="carousel-slide">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CenterCarousel;
