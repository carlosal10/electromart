import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MdAccountCircle,
  MdFavoriteBorder,
  MdShoppingCart,
  MdSearch,
  MdLocationOn,
  MdCategory,
  MdPhone
} from 'react-icons/md';
import './Navbar.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);

  const dropdownRef = useRef();

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

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };

    if (showCategories) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategories]);

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="location">
          <MdLocationOn size={18} />
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
            <button className="search-icon">
              <MdSearch size={22} />
            </button>
          </div>
        </div>
        <div className="header-actions">
          <button className="nav-toggle" onClick={() => setShowCategories(!showCategories)}>
            <MdCategory size={18} style={{ marginRight: 6 }} />
            Categories
          </button>
          <div className="contact">
            <MdPhone size={18} style={{ marginRight: 6 }} />
            777-777-7777
          </div>
          <div className="action-icons">
            <Link to="/login" className="icon-button" title="Account">
              <MdAccountCircle size={22} />
            </Link>
            <Link to="/wishlist" className="icon-button" title="Wishlist">
              <MdFavoriteBorder size={22} />
            </Link>
            <Link to="/cart" className="icon-button" title="Cart">
              <MdShoppingCart size={22} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mega Dropdown */}
      {showCategories && (
        <div className="mega-dropdown" ref={dropdownRef}>
          {categories.length ? (
            categories.map(cat => (
              <div key={cat._id} className="mega-col">
                <Link to={`/category/${cat.name.toLowerCase()}`} className="main-cat-title">
                  {cat.name}
                </Link>
                <ul className="mega-sub-list">
                  {cat.subcategories?.map(sub => (
                    <li key={sub.name}>
                      <Link to={`/category/${cat.name.toLowerCase()}/${sub.name.toLowerCase()}`}>
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="empty-message">No categories available</p>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
