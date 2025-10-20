// src/pages/Login.jsx
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

  // Determine if this login is for accessing admin (current path or "from" target)
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
    // If admin is required but user is not admin -> forbidden
    if (isAdminContext && role !== 'admin') {
      toast.error('Admins only.');
      navigate('/forbidden', { replace: true, state: { from: location } });
      return;
    }
    // If admin, prefer admin dashboard
    if (role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }
    // Normal user: go back to intended page or fallback
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
      // Attempt login
      const { data } = await api.post('/api/auth/login', {
        emailOrPhone: form.emailOrPhone.trim(),
        password: form.password,
      });

      // Dev logging: show raw login response to help debug missing token issues
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.info('[login] raw login response:', data);
      }

      // Store token if provided
      const token = extractToken(data);
      if (token) localStorage.setItem('token', token);

      // Verify session/token and get role
      const me = await api.get('/api/auth/me'); // expects { id, email, role }
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.info('[login] /me response:', me);
      }
      if (!me?.data?.id) throw new Error('Could not verify session after login.');

      toast.success('Login successful!');
      finalizeRedirect(me.data.role);
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

      {!isAdminContext && (
        <div className="auth-links">
          <p>
            Don’t have an account?{' '}
            <span className="auth-link" onClick={() => navigate('/signup')}>
              Sign up
            </span>
          </p>
          <p>
            <span className="auth-link" onClick={() => navigate('/forgot-password')}>
              Forgot password?
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
