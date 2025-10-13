import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiUrl } from '../../utils/api';
import './FormStyles.css';

const AddBrandForm = () => {
  const [categories, setCategories] = useState([]);
  const [mainCategory, setMainCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(apiUrl('/api/categories'));
        const data = await res.json();
        setCategories(data);
      } catch {
        toast.error('Failed to load categories');
      }
    }
    fetchCategories();
  }, []);

  const getSubcategories = () => {
    const selected = categories.find(cat => cat.name === mainCategory);
    return selected?.subcategories || [];
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!mainCategory || !subcategory || !brandName.trim()) {
      return toast.error('Please fill all fields');
    }

    const selectedCategory = categories.find(cat => cat.name === mainCategory);
    if (!selectedCategory) return toast.error('Selected category not found');

    const categoryId = selectedCategory._id;

    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/categories/${categoryId}/subcategory/${subcategory}/brand`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: brandName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not add brand');

      toast.success('Brand added successfully');
      setBrandName('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Add Brand</h3>

      <div className="form-grid">
        <select value={mainCategory} onChange={e => {
          setMainCategory(e.target.value);
          setSubcategory('');
        }}>
          <option value="">Main Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select value={subcategory} onChange={e => setSubcategory(e.target.value)} disabled={!mainCategory}>
          <option value="">Subcategory</option>
          {getSubcategories().map(sub => (
            <option key={sub.name} value={sub.name}>{sub.name}</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Brand Name"
        value={brandName}
        onChange={e => setBrandName(e.target.value)}
        required
      />

      <button type="submit" className="btn-red" disabled={loading}>
        {loading ? 'Adding...' : 'Add Brand'}
      </button>
    </form>
  );
};

export default AddBrandForm;
