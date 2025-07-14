import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import './App.css';

const Home = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/hero');
        const data = await res.json();
        setHeroData(data);
      } catch (err) {
        console.error('Failed to load hero data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <main className="home-content">
      <h1 className="section-title">Featured Products</h1>

      {loading ? (
        <div className="loading">Loading featured product...</div>
      ) : heroData ? (
        <Hero data={heroData} />
      ) : (
        <div className="error">No featured content available.</div>
      )}

      <section className="marketplace">
        <h2 className="section-title">Marketplace</h2>
        <div className="categories">
          <span className="category-tag">Categories</span>
          {/* TODO: Dynamically render categories here */}
        </div>
      </section>
    </main>
  );
};

export default Home;
