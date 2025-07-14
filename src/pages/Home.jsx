// src/App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Navbar';
import Hero from './components/Hero';
import './App.css';

function App() {
  const [heroData, setHeroData] = useState(null);
  
  // Simulating API call to fetch hero content
  useEffect(() => {
    // This would be replaced with actual API call
    const fetchHeroData = async () => {
      // Simulating API response delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHeroData({
        title: "Triple-camera drone",
        subtitle: "DJI Mavic 3 Pro Fly More Combo",
        description: "The DJI Mavic 3 Pro is a powerful triple-camera drone that unlocks new perspectives for aerial photography and filmmaking.",
        buttonText: "Browse Mavic",
        buttonLink: "https://www.dji-mavic.com",
        videoUrl: "/videos/drone-promo.mp4" // This would come from MongoDB
      });
    };
    
    fetchHeroData();
  }, []);

  return (
    <div className="app">
      <Header />
      <main>
        <div className="content-header">
          <h1>Table of contents</h1>
          <nav className="toc-nav">
            <a href="#marketplace">Marketplace</a>
          </nav>
        </div>
        
        {heroData ? (
          <Hero data={heroData} />
        ) : (
          <div className="loading">Loading featured product...</div>
        )}
        
        <section className="marketplace" id="marketplace">
          <h2>Marketplace</h2>
          <div className="categories">
            <span className="category-tag">Categories</span>
            {/* Categories would be dynamically populated */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
