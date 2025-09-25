import React from 'react';
import './Footer.css';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-content">
      <div className="footer-column">
        <h4>My Account</h4>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Register</Link></li>
          <li><Link to="/orders">My Orders</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </div>

      <div className="footer-column">
        <h4>Electromart Store</h4>
        <ul>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/blog">Our Blog</Link></li>
          <li><Link to="/sitemap">Sitemap</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>
      </div>

      <div className="footer-column">
        <h4>Customer Service</h4>
        <ul>
          <li><Link to="/wishlist">Wishlist</Link></li>
          <li><Link to="/compare">Compare Products</Link></li>
          <li><Link to="/shipping">Shipping & Returns</Link></li>
          <li><Link to="/faq">FAQs</Link></li>
        </ul>
      </div>

      <div className="footer-column contact-info">
        <h4>Contact Us</h4>
        <p>Electromart HQ, Nairobi, Kenya</p>
        <p>Phone: +254 712 345 678</p>
        <p>Email: support@electromart.com</p>
        <p>Hours: Mon-Sat, 9am-6pm</p>
      </div>
    </div>

    <div className="footer-bottom">
      <p>&copy; {new Date().getFullYear()} Electromart. All rights reserved.</p>
      <div className="payment-icons">
        <FaCcVisa />
        <FaCcMastercard />
        <FaCcPaypal />
        <FaCcAmex />
      </div>
    </div>
  </footer>
);

export default Footer;
