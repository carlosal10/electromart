// Home.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

import Hero from '../components/Hero';
import PopularProducts from '../components/PopularProducts';
import { apiUrl } from '../utils/api';
import './App.css';

// Helpers
function formatKES(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return 'Ksh —';
  try { return `Ksh ${new Intl.NumberFormat('en-KE').format(Number(amount))}`; }
  catch { return `Ksh ${amount}`; }
}

const IMG_FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="100%" height="100%" fill="%23f2f2f2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial" font-size="20">No image</text></svg>';

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
  const { addToCart } = useCart();

  // Initial data load
  useEffect(() => {
    const ac = new AbortController();

    async function loadInitialData(signal) {
      try {
        const [heroRes, catRes] = await Promise.all([
          fetch(apiUrl('/api/hero'), { signal }),
          fetch(apiUrl('/api/categories'), { signal }),
        ]);
        if (!heroRes.ok) throw new Error(`Hero ${heroRes.status}`);
        if (!catRes.ok) throw new Error(`Categories ${catRes.status}`);

        const hero = await heroRes.json();
        const cats = await catRes.json();
        setHeroData(hero);
        setCategories(cats);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load initial data', err);
          toast.error('Failed to load homepage data. Please retry.');
        }
      } finally {
        setLoadingHero(false);
        setLoadingCats(false);
      }
    }

    loadInitialData(ac.signal);
    return () => ac.abort();
  }, []);

  // Compute query string for products
  const productQuery = useMemo(() => {
    const p = new URLSearchParams();
    if (activeCategory) p.set('category', activeCategory);
    if (activeSub) p.set('subcategory', activeSub);
    return p.toString();
  }, [activeCategory, activeSub]);

  // Load products when filters change
  useEffect(() => {
    if (!activeCategory) { setProducts([]); return; }
    const ac = new AbortController();
    setLoadingProducts(true);

    fetch(apiUrl(`/api/products?${productQuery}`), { signal: ac.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Products ${res.status}`);
        return res.json();
      })
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
          toast.error('Could not load products. Try another filter or refresh.');
        }
      })
      .finally(() => setLoadingProducts(false));

    return () => ac.abort();
  }, [productQuery, activeCategory]);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    if (!product?.inStock) {
      toast.warn('Sorry, this product is out of stock.');
      return;
    }

    addToCart(product);
    toast.success(`${product?.name || 'Item'} added to cart!`);
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
                      src={product?.photoUrls?.[0] || IMG_FALLBACK}
                      alt={product?.name || 'Product'}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = IMG_FALLBACK; }}
                    />
                  </div>
                  <div className="cardBody">
                    <h3>{product?.name || 'Unnamed item'}</h3>
                    <p className="code">Code: {String(product?._id || '').slice(-6)}</p>
                    <p className="price">{formatKES(product?.price)}</p>
                    {Number(product?.discount) > 0 && Number(product?.originalPrice) > 0 && (
                      <span className="discount">
                        (was {formatKES(product.originalPrice)}, save {product.discount}%)
                      </span>
                    )}
                    <p className={`stock ${product?.inStock ? 'inStock' : 'outOfStock'}`}>
                      {product?.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                    <p className="rating">
                      ⭐ {Number(product?.rating) || 4.5} ({Number(product?.reviewsCount) || 12} reviews)
                    </p>
                    {product?.freeShipping && (
                      <p className="shipping">🚚 Free Shipping</p>
                    )}
                    <button
                      className="cartBtn"
                      disabled={!product?.inStock}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <FiShoppingCart style={{ marginRight: '8px' }} />
                      Add to Cart
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
