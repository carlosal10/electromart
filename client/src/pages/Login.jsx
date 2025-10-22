// File: src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../utils/api';
import './auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const fromPath = location.state?.from?.pathname || '';
  const isAdminContext =
    location.pathname.startsWith('/admin') || fromPath.startsWith('/admin');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.emailOrPhone.trim()) return 'Email or phone is required';
    if (!form.password) return 'Password is required';
    return null;
  };

  const extractToken = (data = {}) =>
    data.token || data.accessToken || data.jwt || data.result?.token || null;

  const finalizeRedirect = (role) => {
    if (isAdminContext && role !== 'admin') {
      toast.error('Admins only.');
      navigate('/forbidden', { replace: true, state: { from: location } });
      return;
    }
    if (role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }
    const fallback = '/cart';
    const target = fromPath && !fromPath.startsWith('/admin') ? fromPath : fallback;
    navigate(target, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) { toast.warn(errMsg); return; }

    setLoading(true);
    try {
      // 1) Login -> get token
      const { data } = await api.post('/api/auth/login', {
        emailOrPhone: form.emailOrPhone.trim(),
        password: form.password,
      });

      if (process.env.NODE_ENV !== 'production') {
        console.info('[login] raw login response:', data);
      }

      const token = extractToken(data);
      if (!token) throw new Error('Login succeeded but no token returned.');
      localStorage.setItem('token', token); // persist

      // 2) Verify session with proper Bearer header (critical fix)
      const me = await api.get('/api/auth/me', { authToken: token });

      if (process.env.NODE_ENV !== 'production') {
        console.info('[login] /me response:', me);
      }

      const profile = me?.data || {};
      const userId =
        profile.id ||
        profile._id ||
        profile.userId ||
        profile.user?.id ||
        profile.user?._id ||
        null;
      if (!userId) throw new Error('Could not verify session after login.');
      const role = profile.role ?? profile.user?.role ?? 'user';

      toast.success('Login successful!');
      finalizeRedirect(role);
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>{isAdminContext ? 'Admin Login' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <input
          name="emailOrPhone"
          type="text"
          placeholder="Email or Phone"
          value={form.emailOrPhone}
          onChange={onChange}
          required
          autoComplete="username"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
