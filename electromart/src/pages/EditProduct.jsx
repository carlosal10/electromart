// src/pages/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './add-product.css'; // reuse styles

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [photoPreview, setPhotoPreview] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    stock: '',
    features: '',
    description: '',
    photoUrl: '',   // existing or new Cloudinary URL
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch existing categories & product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('https://ecommerce-electronics-0j4e.onrender.com/api/categories'),
          fetch(`https://ecommerce-electronics-0j4e.onrender.com/api/products/${id}`)
        ]);
        const cats = await catRes.json();
        const prod = await prodRes.json();

        if (!prodRes.ok) throw new Error(prod.error || 'Failed to load product');

        setCategories(cats);
        setSelectedCategory(prod.category);
        setProductForm({
          name: prod.name,
          price: prod.price,
          stock: prod.stock,
          features: prod.features,
          description: prod.description,
          photoUrl: prod.photoUrl || '',
        });
        setPhotoPreview(prod.photoUrl || '');
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload to Cloudinary
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', 'ecom_public_upload');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dderoi7rp/image/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (data.secure_url) {
        setProductForm((prev) => ({ ...prev, photoUrl: data.secure_url }));
        setPhotoPreview(data.secure_url);
        toast.success('Image uploaded');
      } else throw new Error('Upload failed');
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed');
    }
  };

  // Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name, price, stock, features, description, photoUrl
    } = productForm;

    if (![name, price, stock, features, description, selectedCategory, photoUrl]
          .every((v) => v && v !== ''))
    {
      toast.error('Please complete all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://ecommerce-electronics-0j4e.onrender.com/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, price, stock, features, description,
          category: selectedCategory, photoUrl
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Update failed');

      toast.success('Product updated');
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <section className="form-section">
      <ToastContainer />
      <h2>Edit Product</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form className="product-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>Item Name</label>
            <input type="text" name="name" value={productForm.name} onChange={handleChange} required />
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price</label>
            <input type="number" name="price" value={productForm.price} onChange={handleChange} required />
          </div>

          {/* Stock */}
          <div className="form-group">
            <label>Stock Availability</label>
            <input type="number" name="stock" value={productForm.stock} onChange={handleChange} required />
          </div>

          {/* Features */}
          <div className="form-group">
            <label>Specifications / Features</label>
            <textarea name="features" rows="3" value={productForm.features} onChange={handleChange} required />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Product Description</label>
            <textarea name="description" rows="3" value={productForm.description} onChange={handleChange} required />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div className="form-group">
            <label>Upload Product Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {photoPreview && (
              <img src={photoPreview}
                   alt="Preview"
                   className="preview"
                   style={{ marginTop: '10px', maxWidth: '200px', borderRadius: '8px' }} />
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn-red" disabled={loading}>
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      )}
    </section>
  );
};

export default EditProduct;
