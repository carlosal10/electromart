import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Banner from './Banner';
import "./RightColumn.css";
const RightColumn = () => {
  const [data, setData] = useState({ banners: [], products: [] });

  useEffect(() => {
    axios.get('https://ecommerce-electronics-0j4e.onrender.com/api/showcase/right').then(res => setData(res.data));
  }, []);

  return (
    <>
      {data.products.map((product) => (
        <ProductCard key={product._id} data={product} />
      ))}
      {data.banners.slice(0, 3).map((banner, i) => (
        <Banner key={i} data={banner} />
      ))}
    </>
  );
};

export default RightColumn;
