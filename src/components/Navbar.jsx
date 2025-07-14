import React from 'react';
import styles from './Navbar.css';
import { Link } from 'react-router-dom';


const Header = () => {
  const [searchQuery, setSearchQuery] = useState('对roo777-777- lh @ 如');
  const [showCategories, setShowCategories] = useState(false);

  return (
    <header className="header">
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
          <a href="#">Onsale</a>
          <a href="#">$v</a>
          <a href="#">English</a>
          <a href="#">y</a>
        </nav>
      </div>
      
      <div className="header-main">
        <div className="logo">DroneHub</div>
        
        <div className="search-container">
          <div className="search-bar">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
            />
            <button className="search-icon">Q</button>
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
      
      {showCategories && (
        <div className="categories-dropdown">
          <a href="#">Drones</a>
          <a href="#">Cameras</a>
          <a href="#">Accessories</a>
          <a href="#">Batteries</a>
          <a href="#">Controllers</a>
        </div>
      )}
    </header>
  );
};

export default Header;
