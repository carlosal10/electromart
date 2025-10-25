import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const Profile = () => {
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/profile')
      .then(({ data }) => {
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      })
      .catch(err => {
        console.error('Failed to load profile', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/profile', form);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert(err.message || 'Failed to update profile');
    }
  };

  if (!localStorage.getItem('token')) {
    return <p style={{ padding: '1rem' }}>Please log in to view your profile.</p>;
  }
  if (loading) return <p style={{ padding: '1rem' }}>Loading profile...</p>;

  return (
    <div className="profile-page" style={{ padding: '1rem' }}>
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
        <label>
          Name:
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
        </label>
        <label>
          Phone:
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Your phone number" />
        </label>
        <label>
          Address:
          <input name="address" value={form.address} onChange={handleChange} placeholder="Your address" />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
