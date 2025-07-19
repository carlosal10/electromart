import React from 'react';
import './Banner.css';

const Banner = ({ data }) => {
  return (
    <div className="banner" style={{ backgroundImage: `url(${data.photoUrl})` }}>
      <div className="banner-content">
        <h3>{data.title}</h3>
        <p>{data.subtitle}</p>
        {data.buttonText && <button>{data.buttonText}</button>}
      </div>
    </div>
  );
};

export default Banner;
