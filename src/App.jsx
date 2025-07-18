import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

import ProductDetail from './components/ProductDetail';
import FloatingCart from './components/FloatingCart';
import MiniCart from './components/MiniCart';

import { CartProvider, useCart } from './context/CartContext';

const AppRoutes = () => {
  const { isMiniCartOpen, setMiniCartOpen } = useCart();

  return (
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
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/products" element={<AdminProductList />} />
        <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminOverview />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>

      <Footer />

      {/* Floating Cart + Slide Mini Cart */}
      <FloatingCart onClick={() => setMiniCartOpen(true)} />
      <MiniCart isOpen={isMiniCartOpen} onClose={() => setMiniCartOpen(false)} />

      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

const App = () => (
  <CartProvider>
    <AppRoutes />
  </CartProvider>
);

export default App;
