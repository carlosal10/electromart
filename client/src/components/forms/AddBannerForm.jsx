import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { apiUrl } from '../../utils/api';
import './FormStyles.css';

const AddBannerForm = () => {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    type: 'hero' // default to 'hero'
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

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
        setForm((prev) => ({ ...prev, imageUrl: data.secure_url }));
        toast.success('Banner image uploaded!');
      }
    } catch {
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.imageUrl) {
      toast.error('Title and image are required.');
      return;
    }

    try {
      const res = await fetch(apiUrl('/api/hero'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Something went wrong');

      toast.success('Banner added!');
      setForm({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        buttonText: '',
        buttonLink: '',
        type: 'hero'
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Add Banner</h3>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        name="subtitle"
        placeholder="Subtitle"
        value={form.subtitle}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        rows={3}
        value={form.description}
        onChange={handleChange}
      />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {form.imageUrl && (
        <img src={form.imageUrl} alt="Preview" className="preview-img" />
      )}
      <input
        name="buttonText"
        placeholder="Button Text"
        value={form.buttonText}
        onChange={handleChange}
      />
      <input
        name="buttonLink"
        placeholder="Button Link"
        value={form.buttonLink}
        onChange={handleChange}
      />
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="hero">Hero</option>
        <option value="seasonal">Seasonal</option>
        <option value="promo">Promo</option>
        <option value="bestSelling">Best Selling</option>
      </select>

      <button type="submit" className="btn-red" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Submit Banner'}
      </button>
    </form>
  );
};

export default AddBannerForm;
