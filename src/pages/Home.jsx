import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import './App.css';

const Home = () => {
  const [heroData, setHeroData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [heroRes, catRes] = await Promise.all([
          fetch('https://ecommerce-electronics-0j4e.onrender.com/api/hero'),
          fetch('https://ecommerce-electronics-0j4e.onrender.com/api/categories'),
        ]);
        const hero = await heroRes.json();
        const cats = await catRes.json();
        setHeroData(hero);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        setLoadingHero(false);
        setLoadingCats(false);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    setLoadingProducts(true);

    const params = new URLSearchParams({ category: activeCategory });
    if (activeSub) params.set('subcategory', activeSub);

    fetch(`https://ecommerce-electronics-0j4e.onrender.com/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, [activeCategory, activeSub]);

  return (
    <div className="home-container">
      {/* 🔥 Hero Banner */}
      {loadingHero ? (
        <div className="loading">Loading banner...</div>
      ) : heroData.length > 0 ? (
        <Hero data={heroData} />
      ) : (
        <div className="error">No featured banners.</div>
      )}

      {/* 🛍 Layout */}
      <div className="layout">
        {/* 📂 Sidebar Filters */}
        <aside className="filters">
          <h3>Browse Categories</h3>
          {loadingCats ? (
            <p>Loading...</p>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="filter-group">
                <button
                  className={`filter-btn ${activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setActiveSub(null);
                  }}
                >
                  {cat.name}
                </button>
                {activeCategory === cat.name && cat.subcategories?.length > 0 && (
                  <ul className="sub-filter-list">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.name}>
                        <button
                          className={`sub-btn ${activeSub === sub.name ? 'active' : ''}`}
                          onClick={() => setActiveSub(sub.name)}
                        >
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </aside>

        {/* 🛒 Products */}
        <section className="products-section">
          <h2 className="section-title">
            {activeSub || activeCategory || 'Our Products'}
          </h2>

          {loadingProducts ? (
            <div className="loading">Loading products...</div>
          ) : products.length > 0 ? (
            <div className="product-grid">
              {products.map((p) => (
                <div key={p._id} className="product-card">
                  <img src={p.photoUrl} alt={p.name} className="product-img" />
                  <h3>{p.name}</h3>
                  <p>Ksh {p.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="error">No products found in this category.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
