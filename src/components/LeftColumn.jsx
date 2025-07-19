import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Banner from './Banner';
import "./LeftColumn.css";
const LeftColumn = () => {
  const [data, setData] = useState({ banners: [], products: [] });

  useEffect(() => {
    axios.get('https://ecommerce-electronics-0j4e.onrender.com/api/showcase/left').then(res => {
    console.log('Left Column Data:', res.data);
    setData(res.data);
  });
}, []);
  return (
    <>
      {data.banners.slice(0, 3).map((banner, i) => (
        <Banner key={i} data={banner} />
      ))}
      {data.products.map((product) => (
        <ProductCard key={product._id} data={product} />
      ))}
    </>
  );
};

export default LeftColumn;
