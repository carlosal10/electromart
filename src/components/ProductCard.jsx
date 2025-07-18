import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

const DynamicProductCard = ({ product }) => {
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="relative group bg-white rounded-md shadow-sm border cursor-pointer overflow-hidden hover:shadow-lg transition"
    >
      <img
        src={product.photoUrls?.[0]}
        alt={product.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        <h4 className="text-sm font-semibold truncate">{product.name}</h4>
        <p className="text-sm text-gray-600">
          ${product.discountedPrice || product.price}
        </p>
        <div className="text-yellow-500 text-xs">★★★★☆</div>
        {product.freeShipping && (
          <span className="text-xs mt-1 inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded">
            Free Shipping
          </span>
        )}
      </div>

      <button
        className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
        onClick={(e) => {
          e.stopPropagation();
          // dispatch(addToCart(product)) if needed
        }}
      >
        <FiShoppingCart />
      </button>
    </div>
  );
};

export default DynamicProductCard;
