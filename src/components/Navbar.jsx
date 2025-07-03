import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <header className="navbar">
    <div className="logo">ElectroMart</div>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/add-product">Add Product</Link>
      <Link to="/shop">Shop</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/login">Login</Link>
    </nav>
  </header>
);

export default Navbar;
