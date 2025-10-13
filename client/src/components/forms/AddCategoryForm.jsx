import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiUrl } from '../../utils/api';
import './FormStyles.css';

const AddCategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [mainCategory, setMainCategory] = useState('');
  const [newMainCategory, setNewMainCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(apiUrl('/api/categories'));
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        toast.error('Failed to load categories');
      }
    }
    fetchCategories();
  }, []);

  const handleAddMainCategory = async () => {
    if (!newMainCategory.trim()) return;
    try {
      const res = await fetch(apiUrl('/api/categories'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMainCategory }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCategories(prev => [...prev, data.category]);
      toast.success('Main category added!');
      setNewMainCategory('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddSubcategory = async () => {
    if (!mainCategory || !newSubcategory.trim()) return;
    try {
      const res = await fetch(apiUrl(`/api/categories/${mainCategory}/add-sub`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubcategory }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('Subcategory added!');
      setNewSubcategory('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="admin-form">
      <h3>Add Categories</h3>

      <div className="form-inline">
        <input
          type="text"
          placeholder="New Main Category"
          value={newMainCategory}
          onChange={(e) => setNewMainCategory(e.target.value)}
        />
        <button type="button" className="btn-red" onClick={handleAddMainCategory}>
          Add Main
        </button>
      </div>

      <div className="form-inline">
        <select value={mainCategory} onChange={(e) => setMainCategory(e.target.value)}>
          <option value="">Select Main Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New Subcategory"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
        />
        <button type="button" className="btn-red" onClick={handleAddSubcategory}>
          Add Subcategory
        </button>
      </div>
    </div>
  );
};

export default AddCategoryForm;
