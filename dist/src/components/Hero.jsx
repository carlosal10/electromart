import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Hero.css';

const Hero = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  const heroBanners = data.filter(banner => banner.type === 'hero');

  if (heroBanners.length === 0) return null;

  return (
    <section className="hero-wrapper">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="hero-swiper"
      >
        {heroBanners.map((banner) => (
          <SwiperSlide key={banner._id || banner.title}>
            <div className="hero">
              <div
                className="hero-bg"
                style={{
                  backgroundImage: `url(${banner.imageUrl || '/images/fallback.jpg'})`,
                }}
              />
              <div className="video-overlay" />
              <div className="hero-content">
                <div className="product-tags">
                  <span className="product-tag">New</span>
                  <span className="product-tag">Premium</span>
                </div>
                <h2>{banner.title}</h2>
                {banner.subtitle && <h3>{banner.subtitle}</h3>}
                {banner.description && <p>{banner.description}</p>}
                {banner.buttonText && banner.buttonLink && (
                  <a
                    href={banner.buttonLink}
                    className="cta-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {banner.buttonText}
                  </a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
