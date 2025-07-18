import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import DynamicProductCard from './ProductCard';

const ShowcaseRight = () => {
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    axios.get('https://ecommerce-electronics-0j4e.onrender.com/api/products?tag=deal&limit=3').then(res => setProducts(res.data));
    axios.get('https://ecommerce-electronics-0j4e.onrender.com/api/hero?section=midweek').then(res => setBanner(res.data));
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
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <Slider {...settings}>
          {products.map(p => (
            <div key={p._id} className="px-2">
              <DynamicProductCard product={p} />
            </div>
          ))}
        </Slider>
      </div>

      {banner && (
        <div className="relative h-40 bg-gradient-to-r from-indigo-600 to-purple-500 text-white p-4 rounded-xl shadow-md">
          <h4 className="text-lg font-semibold">{banner.title}</h4>
          <p className="text-sm">{banner.subtitle}</p>
          <button className="mt-2 bg-white text-indigo-700 px-3 py-1 text-xs rounded">
            {banner.buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowcaseRight;
