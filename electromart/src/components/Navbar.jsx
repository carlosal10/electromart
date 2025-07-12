import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, PlusSquare, ShoppingBag, ShoppingCart, LogIn } from 'lucide-react'; // Icons
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="logo">ElectroMart</div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      <nav ref={menuRef} className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <Home size={18} /> Home
        </Link>
        <Link to="/add-product" onClick={() => setMenuOpen(false)}>
          <PlusSquare size={18} /> Add Product
        </Link>
        <Link to="/shop" onClick={() => setMenuOpen(false)}>
          <ShoppingBag size={18} /> Shop
        </Link>
        <Link to="/cart" onClick={() => setMenuOpen(false)}>
          <ShoppingCart size={18} /> Cart
        </Link>
        <Link to="/login" onClick={() => setMenuOpen(false)}>
          <LogIn size={18} /> Login
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
