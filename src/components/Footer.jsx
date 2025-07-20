import React from 'react';
import './Footer.css';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* My Account */}
        <div className="footer-column">
          <h4>My Account</h4>
          <ul>
             <Link to="/login" className="icon-button" title="Account">
            </Link>
            <li><a href="/register">Register</a></li>
            <li><a href="/orders">My Orders</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>

        {/* Electromart Store */}
        <div className="footer-column">
          <h4>Electromart Store</h4>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/blog">Our Blog</a></li>
            <li><a href="/sitemap">Sitemap</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-column">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="/wishlist">Wishlist</a></li>
            <li><a href="/compare">Compare Products</a></li>
            <li><a href="/shipping">Shipping & Returns</a></li>
            <li><a href="/faq">FAQs</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="footer-column contact-info">
          <h4>Contact Us</h4>
          <p>Electromart HQ, Nairobi, Kenya</p>
          <p>Phone: +254 712 345 678</p>
          <p>Email: support@electromart.com</p>
          <p>Hours: Mon–Sat, 9am–6pm</p>
        </div>
      </div>

      {/* Bottom row */}
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
};

export default Footer;
