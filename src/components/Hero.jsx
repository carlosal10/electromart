// src/components/Hero.js
import React, { useRef, useEffect } from 'react';
import './Hero.css';

const Hero = ({ data }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented, showing fallback:", error);
      });
    }
  }, []);

  return (
    <section className="hero">
      <div className="video-container">
        <video 
          ref={videoRef}
          muted 
          loop 
          playsInline
          className="hero-video"
          poster="/images/drone-poster.jpg" // Fallback image
        >
          <source src={data.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="product-tags">
          <span className="product-tag">New</span>
          <span className="product-tag">Premium</span>
        </div>
        
        <h2>{data.title}</h2>
        <h3>{data.subtitle}</h3>
        <p>{data.description}</p>
        
        <a 
          href={data.buttonLink} 
          className="cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          {data.buttonText}
        </a>
      </div>
    </section>
  );
};

export default Hero;
