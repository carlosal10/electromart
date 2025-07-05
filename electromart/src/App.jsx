import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Shop from './pages/Shop';
import Login from './pages/Login';
import AdminProductList from './pages/AdminProductList';
import EditProduct from './pages/EditProduct';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';

const App = () => (
  <CartProvider> {/* ✅ Enable Cart Context Globally */}
    <Router> {/* ✅ Required for Routes to work */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/products" element={<AdminProductList />} />
        <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
      <Footer />
    </Router>
  </CartProvider>
);

export default App;
