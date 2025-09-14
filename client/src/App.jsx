// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminOverview from './pages/AdminOverview';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminEntryPage from './pages/AdminEntryPage';

const App = () => (
  <>
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Admin Routes under /admin */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="data-entry" element={<AdminEntryPage />} />
      </Route>

      {/* Catch-all redirects to admin */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>

    <Footer />
  </>
);

export default App;
