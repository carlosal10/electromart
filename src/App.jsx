// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CartPage from './pages/CartPage';
import MyOrders from './pages/MyOrders';
import EditProduct from './pages/EditProduct';
import AdminProductList from './pages/AdminProductList';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';

import { CartProvider } from './context/CartContext';

const App = () => (
  <CartProvider>
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Admin Product List (outside nested admin) */}
        <Route path="/admin/products" element={<AdminProductList />} />
        <Route path="/admin/edit-product/:id" element={<EditProduct />} />

        {/* Admin Dashboard with nested routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminOverview />} />           {/* Default admin tab */}
          <Route path="overview" element={<AdminOverview />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
      <Footer />
    </>
  </CartProvider>
);

export default App;
