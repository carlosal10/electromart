import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="location">
          <span className="location-icon">📍</span>
          <span>Kenya</span>
        </div>

        <nav className="main-nav">
          <a href="#">Vendors</a>
          <a href="#">Promotions</a>
          <a href="#">Brands</a>
          <a href="#">Newest</a>
          <a href="#">Bestsellers</a>
          <a href="#">On Sale</a>
          <a href="#">English</a>
        </nav>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="logo">Electromart</div>

        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
            />
            <button className="search-icon">🔍</button>
          </div>
        </div>

        <div className="header-actions">
          <button className="nav-toggle" onClick={() => setShowCategories(!showCategories)}>
            Categories
          </button>
          <div className="contact">📞 777-777-7777</div>
          <div className="action-icons">
            <Link to="/account" className="icon-button">👤</Link>
            <Link to="/wishlist" className="icon-button">❤️</Link>
            <Link to="/cart" className="icon-button">🛒</Link>
          </div>
        </div>
      </div>

      {/* Dynamic Category Dropdown */}
      {showCategories && (
        <div className="categories-dropdown">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat._id} className="category-group">
                <Link
                  to={`/category/${cat.name.toLowerCase()}`}
                  className="main-category-link"
                >
                  {cat.name}
                </Link>
                {cat.subcategories?.length > 0 && (
                  <div className="subcategory-list">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={`/category/${cat.name.toLowerCase()}/${sub.name.toLowerCase()}`}
                        className="subcategory-link"
                      >
                        - {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ padding: '1rem', color: '#777' }}>No categories available</p>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
