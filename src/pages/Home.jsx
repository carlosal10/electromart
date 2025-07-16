import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import PopularProducts from '../components/PopularProducts';
import './App.css';
import './PopularProducts.css'; // ✅ Reusing popular styles

const Home = () => {
  const [heroData, setHeroData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const navigate = useNavigate();

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

  const handleCardClick = (id) => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    console.log('🛒 Add to cart:', product);
    // 🔁 Replace with context/Redux logic if needed
  };

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

      {/* ✅ Popular Products */}
      <PopularProducts />

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

        {/* 🛒 Products Section */}
        <section className="products-section">
          <h2 className="section-title">
            {activeSub || activeCategory || 'Our Products'}
          </h2>

          {loadingProducts ? (
            <div className="loading">Loading products...</div>
          ) : products.length > 0 ? (
            <div className="productGrid">
              {products.map(product => (
                <div
                  key={product._id}
                  className="card"
                  onClick={() => handleCardClick(product._id)}
                >
                  <div className="imageWrapper">
                    <img
                      src={product.photoUrls?.[0]}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="cardBody">
                    <h3>{product.name}</h3>
                    <p className="code">Code: {product._id.slice(-6)}</p>
                    <p className="price">Ksh {product.price.toLocaleString()}</p>
                    {product.discount && product.originalPrice && (
                      <span className="discount">
                        (was Ksh {product.originalPrice.toLocaleString()}, save {product.discount}%)
                      </span>
                    )}
                    <p className={`stock ${product.inStock ? 'inStock' : 'outOfStock'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                    <p className="rating">
                      ⭐ {product.rating || 4.5} ({product.reviewsCount || 12} reviews)
                    </p>
                    {product.freeShipping && (
                      <p className="shipping">🚚 Free Shipping</p>
                    )}
                    <button
                      className="cartBtn"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
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
