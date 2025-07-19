import React from 'react';
import ProductCard from '../ProductCard';
import BannerCard from '../BannerCard';
import './RightColumn.css'; // You can reuse the same styling as LeftColumn

const RightColumn = ({ rightTopProduct, rightMiddleProduct, bottomBanners }) => {
  return (
    <div className="right-column-container">
      {/* Top Product */}
      {rightTopProduct && (
        <div className="right-card">
          <ProductCard product={rightTopProduct} compact />
        </div>
      )}

      {/* Middle Product */}
      {rightMiddleProduct && (
        <div className="right-card">
          <ProductCard product={rightMiddleProduct} compact />
        </div>
      )}

      {/* Bottom Banners */}
      <div className="right-banner-grid">
        {bottomBanners?.map((banner, index) => (
          <BannerCard key={index} banner={banner} />
        ))}
      </div>
    </div>
  );
};

export default RightColumn;
