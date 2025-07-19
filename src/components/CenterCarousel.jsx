import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import DynamicProductCard from './ProductCard'; // Ensure this file renders only primitives inside JSX
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CenterCarousel.css";

const ShowcaseCenter = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://ecommerce-electronics-0j4e.onrender.com/api/products?featured=true&limit=5')
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch featured products:", err);
        setLoading(false);
      });
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

  if (loading) {
    return <div className="showcase-wrapper">Loading...</div>;
  }

  return (
    <div className="showcase-wrapper">
      <div className="showcase-carousel">
        <Slider {...settings}>
          {products.map(product =>
            product && product._id ? (
              <div key={product._id}>
                <DynamicProductCard product={product} />
              </div>
            ) : null
          )}
        </Slider>
      </div>
    </div>
  );
};

export default ShowcaseCenter;
