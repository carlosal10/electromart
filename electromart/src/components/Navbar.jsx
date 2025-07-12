import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Assume we’re adding styles here

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="navbar">
      <div className="logo">ElectroMart</div>

      <button className="hamburger" onClick={toggleMenu}>
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/add-product" onClick={() => setMenuOpen(false)}>Add Product</Link>
        <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
        <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
        <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
      </nav>
    </header>
  );
};

export default Navbar;
