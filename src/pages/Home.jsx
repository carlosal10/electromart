import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import './App.css';

const Home = () => {
  const [heroData, setHeroData] = useState(null);
  const [categories, setCategories] = useState([]);

  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [products, setProducts] = useState([]);

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [hRes, cRes] = await Promise.all([
          fetch('https://ecommerce-electronics-0j4e.onrender.com/api/hero'),
          fetch('https://ecommerce-electronics-0j4e.onrender.com/api/categories')
        ]);
        const hData = await hRes.json();
        const cData = await cRes.json();
        setHeroData(hData);
        setCategories(cData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHero(false);
        setLoadingCats(false);
      }
    }
    load();
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
    <main className="home-grid">
      <div className="sidebar-cat">
        <h3>Categories</h3>
        {loadingCats
          ? <p>Loading...</p>
          : categories.map(cat => (
            <div key={cat._id} className="cat-group">
              <button
                className={activeCategory === cat.name ? 'cat-btn active' : 'cat-btn'}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setActiveSub(null);
                }}
              >
                {cat.name}
              </button>
              {activeCategory === cat.name && cat.subcategories?.length > 0 && (
                <ul className="sub-list">
                  {cat.subcategories.map(sub => (
                    <li key={sub.name}>
                      <button
                        className={activeSub === sub.name ? 'sub-btn active' : 'sub-btn'}
                        onClick={() => setActiveSub(sub.name)}
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>

      <div className="content">
        <h1 className="section-title">Featured</h1>
        {loadingHero
          ? <div className="loading">Loading hero...</div>
          : heroData
            ? <Hero data={heroData} />
            : <div className="error">No featured content.</div>
        }

        <section style={{ marginTop: '2rem' }}>
          <h2 className="section-title">Products</h2>
          {loadingProducts
            ? <div className="loading">Loading products...</div>
            : products.length > 0
              ? <div className="product-grid">
                  {products.map(p => (
                    <div key={p._id} className="product-card">
                      <img src={p.photoUrl} alt={p.name} />
                      <h3>{p.name}</h3>
                      <p>Ksh {p.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              : <div className="error">No products found.</div>
          }
        </section>
      </div>
    </main>
  );
};

export default Home;
