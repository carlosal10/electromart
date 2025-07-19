import React, { useEffect, useState } from 'react';
import './ThreeColumnShowcase.css';
import ProductCarousel from './ProductCarousel';
import ProductCard from './ProductCard';
import Banner from './Banner';

const ThreeColumnShowcase = () => {
  const [leftBanners, setLeftBanners] = useState([]);
  const [rightBanners, setRightBanners] = useState([]);
  const [leftProducts, setLeftProducts] = useState([]);
  const [rightProducts, setRightProducts] = useState([]);
  const [centerProducts, setCenterProducts] = useState([]);

  useEffect(() => {
    // Fetch banners and products
    const fetchData = async () => {
      try {
        const [bannersRes, productsRes] = await Promise.all([
          fetch('https://ecommerce-electronics-0j4e.onrender.com/api/hero'),
          fetch('https://ecommerce-electronics-0j4e.onrender.com/api/products'),
        ]);

        const banners = await bannersRes.json();
        const products = await productsRes.json();

        // Assume backend returns an array of banners and products
        setLeftBanners(banners.slice(0, 2));
        setRightBanners(banners.slice(2, 4));

        setLeftProducts(products.slice(0, 2));
        setCenterProducts(products.slice(2, 6));
        setRightProducts(products.slice(6, 8));
      } catch (error) {
        console.error('Error loading showcase content:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="three-column-grid">
      {/* LEFT COLUMN */}
      <div className="column left-column">
        {leftBanners.map((banner) => (
          <Banner key={banner._id} banner={banner} />
        ))}
        {leftProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* CENTER COLUMN */}
      <div className="column center-column">
        <ProductCarousel products={centerProducts} />
      </div>

      {/* RIGHT COLUMN */}
      <div className="column right-column">
        {rightProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {rightBanners.map((banner) => (
          <Banner key={banner._id} banner={banner} />
        ))}
      </div>
    </div>
  );
};

export default ThreeColumnShowcase;
