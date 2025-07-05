import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ No BrowserRouter here
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminProductList from './pages/AdminProductList';
import EditProduct from './pages/EditProduct';
import CartPage from './pages/CartPage';

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/products" element={<AdminProductList />} />
      <Route path="/admin/edit-product/:id" element={<EditProduct />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
    <Footer />
  </>
);

export default App;
