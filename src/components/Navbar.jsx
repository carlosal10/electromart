import React from 'react';
import styles from './Navbar.css';

const Header = () => (
  <header className={styles.navbar}>
    <div className={styles.logo}>Marketplace Demo</div>
    <nav>
      <ul className={styles.navLinks}>
        <li><a href="#">Categories</a></li>
        <li><a href="#">Support</a></li>
        <li><a href="#">Blog</a></li>
      </ul>
    </nav>
    <div className={styles.searchContact}>
      <input type="text" placeholder="Search products..." />
      <span>📞 +1(800)777-7777</span>
    </div>
    <div className={styles.iconStrip}>
      <span>👤</span>
      <span>❤️</span>
      <span>🛒</span>
    </div>
  </header>
);

export default Header;
