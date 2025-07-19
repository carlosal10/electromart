import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Banner from './Banner';
import './RightColumn.css';

const RightColumn = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchRightColumnData = async () => {
      try {
        const response = await axios.get('https://ecommerce-electronics-0j4e.onrender.com/api/showcase/right');
        console.log('Right Column Data:', response.data);

        setProducts(response.data.products || []);
        setBanners(response.data.banners || []);
      } catch (error) {
        console.error('Error fetching right column data:', error);
      }
    };

    fetchRightColumnData();
  }, []);

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
      {banners.slice(0, 3).map((banner, i) => (
        <Banner key={banner._id || i} banner={banner} />
      ))}
    </>
  );
};

export default RightColumn;
