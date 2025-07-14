import React, { useState, useEffect } from 'react';
import Header from '../components/Navbar'; // Adjust path if needed
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
    <div className="app">
      <Header />
      <main>
        <div className="content-header">
          <h1>Featured Products</h1>
          <nav className="toc-nav">
            <a href="#marketplace">Marketplace</a>
          </nav>
        </div>

        {loading ? (
          <div className="loading">Loading featured product...</div>
        ) : heroData ? (
          <Hero data={heroData} />
        ) : (
          <div className="error">No content found</div>
        )}

        <section className="marketplace" id="marketplace">
          <h2>Marketplace</h2>
          <div className="categories">
            <span className="category-tag">Categories</span>
            {/* You can add category listing here */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
