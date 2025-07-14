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
          <span>4 Boston</span>
        </div>

        <nav className="main-nav">
          <a href="#">Vendors</a>
          <a href="#">Promotions</a>
          <a href="#">Brands</a>
          <a href="#">Newest</a>
          <a href="#">Bestsellers</a>
          <a href="#">On Sale</a>
          <a href="#">$v</a>
          <a href="#">English</a>
          <a href="#">y</a>
        </nav>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="logo">DroneHub</div>

        {/* Search Bar */}
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

        {/* Actions */}
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

      {/* Dynamic Categories Dropdown */}
      {showCategories && (
        <div className="categories-dropdown">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link key={cat._id} to={`/category/${cat.name.toLowerCase()}`}>
                {cat.name}
              </Link>
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
