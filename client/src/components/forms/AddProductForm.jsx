import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiUrl } from '../../utils/api';
import './FormStyles.css'; // Shared styling for all forms

const ProductForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    features: '',
    inStock: true,
    colors: '',
    sizes: '',
    photoUrls: [],
    isPopular: false, // ✅ Popular flag
    highlightTag: '', // ✅ New: for "seasonal-offer", "best-choice", etc.
  });

  const [categories, setCategories] = useState([]);
  const [mainCategory, setMainCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [previews, setPreviews] = useState([]);
  

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

  const getSubcategories = () => {
    const cat = categories.find(c => c.name === mainCategory);
    return cat?.subcategories || [];
  };

  const getBrands = () => {
    const sub = getSubcategories().find(s => s.name === subcategory);
    return sub?.brands || [];
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async e => {
    const files = Array.from(e.target.files);
    const uploads = [];
    const previews = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ecom_public_upload');

      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dderoi7rp/image/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          uploads.push(data.secure_url);
          previews.push(data.secure_url);
        }
      } catch {
        toast.error('Image upload failed');
      }
    }

    setForm(prev => ({ ...prev, photoUrls: uploads }));
    setPreviews(previews);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!mainCategory || !subcategory || !brand) {
      return toast.error('Category path incomplete');
    }

    const payload = {
      ...form,
      colors: form.colors.split(',').map(c => c.trim()),
      sizes: form.sizes.split(',').map(s => s.trim()),
      mainCategory,
      subcategory,
      brand,
    };

    onSubmit(payload);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Add Product</h3>

      <div className="form-grid">
        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />

        <select
          value={form.inStock}
          onChange={e => setForm(prev => ({ ...prev, inStock: e.target.value === 'true' }))}
        >
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>

        {/* ✅ Popular product checkbox */}
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isPopular"
            checked={form.isPopular}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, isPopular: e.target.checked }))
            }
          />
          Mark as Popular Product
        </label>

        {/* ✅ Highlight Tag Selector */}
        <select
          name="highlightTag"
          value={form.highlightTag}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">No Highlight</option>
          <option value="seasonal-offer">Seasonal Offer</option>
          <option value="best-choice">Best Choice</option>
          <option value="flash-sale">Flash Sale</option>
        </select>

        <input name="colors" placeholder="Colors (comma separated)" value={form.colors} onChange={handleChange} />
        <input name="sizes" placeholder="Sizes (comma separated)" value={form.sizes} onChange={handleChange} />
      </div>

      <textarea name="features" placeholder="Specifications" rows={3} value={form.features} onChange={handleChange} />
      <textarea name="description" placeholder="Product Description" rows={3} value={form.description} onChange={handleChange} />

      <div className="form-grid">
        <select value={mainCategory} onChange={e => { setMainCategory(e.target.value); setSubcategory(''); setBrand(''); }}>
          <option value="">Main Category</option>
          {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>

        <select value={subcategory} onChange={e => { setSubcategory(e.target.value); setBrand(''); }} disabled={!mainCategory}>
          <option value="">Subcategory</option>
          {getSubcategories().map(sub => <option key={sub.name} value={sub.name}>{sub.name}</option>)}
        </select>

        <select value={brand} onChange={e => setBrand(e.target.value)} disabled={!subcategory}>
          <option value="">Brand</option>
          {getBrands().map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <input type="file" multiple accept="image/*" onChange={handleImageChange} />
      <div className="preview-grid">
        {previews.map((src, i) => (
          <img key={i} src={src} alt="preview" className="preview-img" />
        ))}
      </div>

      <button type="submit" className="btn-red">Submit Product</button>
    </form>
  );
};

export default ProductForm;
