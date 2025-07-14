import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import './App.css';

const Home = () => {
  const [heroData, setHeroData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/hero');
        const data = await res.json();
        setHeroData(data);
      } catch (err) {
        console.error('Failed to load hero data:', err);
      } finally {
        setLoadingHero(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchHeroData();
    fetchCategories();
  }, []);

  return (
    <main className="home-content">
      <h1 className="section-title">Featured Product</h1>

      {loadingHero ? (
        <div className="loading">Loading hero content...</div>
      ) : heroData ? (
        <Hero data={heroData} />
      ) : (
        <div className="error">No featured product available.</div>
      )}

      <h2 className="section-title" style={{ marginTop: '3rem' }}>Categories</h2>
      {loadingCategories ? (
        <div className="loading">Loading categories...</div>
      ) : categories.length ? (
        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat._id} className="category-item">
              {cat.name}
            </li>
          ))}
        </ul>
      ) : (
        <div className="error">No categories available.</div>
      )}
    </main>
  );
};

export default Home;
