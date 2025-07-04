import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './add-product.css'; // Your CSS

const AddProduct = () => {
  const navigate = useNavigate();

  const [photoPreview, setPhotoPreview] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    stock: '',
    features: '',
    description: '',
    photo: '' // Now holds Cloudinary URL
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        toast.error('Failed to load categories');
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  // Upload image to Cloudinary
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ecom_public_upload'); // Replace with your preset

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dderoi7rp/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setProductForm((prev) => ({ ...prev, photo: data.secure_url }));
        setPhotoPreview(data.secure_url);
        toast.success('Image uploaded!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      toast.error('Image upload failed');
      console.error(err);
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    const payload = {
      ...productForm,
      category: selectedCategory,
    };

    setLoading(true);
    try {
      const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Unknown error');

      toast.success('Product added!');
      setTimeout(() => navigate('/admin/products'), 2000);
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const name = categoryName.trim();
    if (!name) return;

    try {
      const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Unknown error');
      toast.success('Category added!');
      setCategoryName('');
      setCategories((prev) => [...prev, { name, _id: Date.now().toString() }]);
    } catch (err) {
      toast.error('Failed to add category: ' + err.message);
    }
  };

  return (
<section className="form-section">
    <h3 style={{ marginTop: '10px' }}>Add Category</h3>
      <form className="product-form" onSubmit={handleCategorySubmit}>
        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text"
            name="category"
            placeholder="e.g., Smartphones"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-red">Add Category</button>
      </form>
    
      <ToastContainer />
      <h2>Add New Product</h2>

      <form className="product-form" onSubmit={handleProductSubmit}>
        <div className="form-group">
          <label>Item Name</label>
          <input type="text" name="name" value={productForm.name} onChange={handleProductChange} required />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input type="number" name="price" value={productForm.price} onChange={handleProductChange} required />
        </div>

        <div className="form-group">
          <label>Stock Availability</label>
          <input type="number" name="stock" value={productForm.stock} onChange={handleProductChange} required />
        </div>

        <div className="form-group">
          <label>Specifications / Features</label>
          <textarea name="features" rows="3" value={productForm.features} onChange={handleProductChange} required />
        </div>

        <div className="form-group">
          <label>Product Description</label>
          <textarea name="description" rows="3" value={productForm.description} onChange={handleProductChange} required />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Upload Product Photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} required />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="preview"
              style={{ marginTop: '10px', maxWidth: '200px', borderRadius: '8px' }}
            />
          )}
        </div>

        <button type="submit" className="btn-red" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>

      
    </section>
  );
};

export default AddProduct;
