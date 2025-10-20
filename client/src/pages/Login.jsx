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

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.emailOrPhone.trim()) return 'Email or phone is required';
    if (!form.password) return 'Password is required';
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
      const { data } = await api.post('/api/auth/login', {
        emailOrPhone: form.emailOrPhone.trim(),
        password: form.password,
      });

      if (!data?.token) throw new Error('No token returned by server');

      localStorage.setItem('token', data.token); // keep key consistent with api.js
      toast.success('Login successful!');

      // Redirect to the page the user originally wanted, or fallback
      const from = location.state?.from?.pathname || '/cart';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>
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
    </div>
  );
};

export default Login;
