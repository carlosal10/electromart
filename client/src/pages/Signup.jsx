// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../utils/api';
import './auth.css';

const initial = { name: '', email: '', phone: '', password: '' };

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email';
    if (!form.phone.trim()) return 'Phone is required';
    if ((form.password || '').length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      toast.warn(errMsg);
      return;
    }
    setLoading(true);
    try {
       await api.post('/api/auth/signup', form);
      // Expecting server to return { ok: true } or created user; adjust if needed
      toast.success('Signup successful — please log in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          autoComplete="name"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={onChange}
          autoComplete="tel"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={onChange}
          autoComplete="new-password"
          required
          minLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up…' : 'Signup'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
