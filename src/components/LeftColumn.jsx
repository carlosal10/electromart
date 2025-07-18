import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DynamicProductCard from './ProductCard';

const ShowcaseLeft = () => {
  const [banner, setBanner] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/banners?section=showcase-left').then(res => setBanner(res.data));
    axios.get('/api/products?limit=2').then(res => setProducts(res.data));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {banner && (
        <div
          className="relative h-48 bg-cover bg-center rounded-xl overflow-hidden shadow"
          style={{ backgroundImage: `url(${banner.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/40 p-4 text-white flex flex-col justify-center">
            <h3 className="text-lg font-bold">{banner.title}</h3>
            <p className="text-sm">{banner.subtitle}</p>
            <button className="mt-2 bg-white text-black text-xs px-3 py-1 rounded">
              {banner.buttonText}
            </button>
          </div>
        </div>
      )}
      {products.map((p) => (
        <DynamicProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default ShowcaseLeft;
