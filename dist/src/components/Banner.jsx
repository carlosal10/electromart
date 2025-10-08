import React from 'react';
import './Banner.css';

const Banner = ({ banner }) => {
  if (!banner) return null;

  const {
    title,
    subtitle,
    description,
    imageUrl,
    buttonText,
    buttonLink,
  } = banner;

  return (
    <div className="banner">
      <img src={imageUrl} alt={title} className="banner-image" />

      <div className="banner-content">
        <h3 className="banner-title">{title}</h3>
        <p className="banner-subtitle">{subtitle}</p>
        <p className="banner-description">{description}</p>

        {buttonText && buttonLink && (
          <a href={buttonLink} className="banner-button">
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

export default Banner;
