import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Forbidden from './pages/Forbidden';
import CartPage from './pages/CartPage';
import ProductDetail from './components/ProductDetail';
import FloatingCart from './components/FloatingCart';
import MiniCart from './components/MiniCart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';

import { CartProvider, useCart } from './context/CartContext';

import AdminDashboard from './admin/AdminDashboard';
import AdminOverview from './admin/AdminOverview';
import AdminOrders from './admin/AdminOrders';
import AdminProducts from './admin/AdminProducts';
import AdminUsers from './admin/AdminUsers';
import AdminEntryPage from './admin/AdminEntryPage';
import AdminRoute from './admin/AdminRoute';

const AppRoutes = () => {
  const { isMiniCartOpen, setMiniCartOpen } = useCart();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="data-entry" element={<AdminEntryPage />} />
        </Route>

        <Route path="/forbidden" element={<Forbidden />} />     
        <Route path="*" element={<Navigate to="/" replace />} />  
      </Routes>

      {!isAdminRoute && (
        <>
          <Footer />
          <FloatingCart onClick={() => setMiniCartOpen(true)} />
          <MiniCart isOpen={isMiniCartOpen} onClose={() => setMiniCartOpen(false)} />
        </>
      )}

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

