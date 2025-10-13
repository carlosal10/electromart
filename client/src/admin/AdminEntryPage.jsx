// src/pages/AdminEntryPage.jsx
import React, { useState } from 'react';
import {
  FiShoppingCart,
  FiFolderPlus,
  FiImage,
  FiTag,
} from 'react-icons/fi';

import AddProductForm from '../components/forms/AddProductForm';
import AddCategoryForm from '../components/forms/AddCategoryForm';
import AddBannerForm from '../components/forms/AddBannerForm';
import AddBrandForm from '../components/forms/AddBrandForm';
import { toast } from 'react-toastify';
import { apiUrl } from '../utils/api';

import './AdminEntryPage.css';

const AdminEntryPage = () => {
  const [activeForm, setActiveForm] = useState('product');

  const handleProductSubmit = async (payload) => {
    console.log('🚀 Submitting Product:', payload);

    try {
      const res = await fetch(apiUrl('/api/products'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log('✅ Product added:', data);
      toast.success('✅ Product added successfully!');
    } catch (err) {
      console.error('❌ Failed to submit product:', err);
      toast.error(`❌ ${err.message || 'Failed to add product'}`);
    }
  };

  const navItems = [
    { key: 'product', label: 'Add Product', icon: <FiShoppingCart /> },
    { key: 'category', label: 'Add Category', icon: <FiFolderPlus /> },
    { key: 'banner', label: 'Add Hero Banner', icon: <FiImage /> },
    { key: 'brand', label: 'Add Brand', icon: <FiTag /> },
  ];

  const renderForm = () => {
    switch (activeForm) {
      case 'product':
        return <AddProductForm onSubmit={handleProductSubmit} />;
      case 'category':
        return <AddCategoryForm />;
      case 'banner':
        return <AddBannerForm />;
      case 'brand':
        return <AddBrandForm />;
      default:
        return <p style={{ padding: '1rem' }}>Select a form to continue</p>;
    }
  };

  return (
    <div className="admin-entry-container">
      <nav className="admin-entry-nav">
        {navItems.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveForm(key)}
            className={`nav-btn ${activeForm === key ? 'active' : ''}`}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="admin-entry-content">
        {renderForm()}
      </div>
    </div>
  );
};

export default AdminEntryPage;
