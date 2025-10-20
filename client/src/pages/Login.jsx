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

  const extractToken = (data = {}) =>
    data.token ||
    data.accessToken ||
    data.jwt ||
    data.result?.token ||
    null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) { toast.warn(errMsg); return; }

    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', {
        emailOrPhone: form.emailOrPhone.trim(),
        password: form.password,
      });

      // 1) If server gives a token in the body, store it
      const token = extractToken(data);
      if (token) {
        localStorage.setItem('token', token);
        toast.success('Login successful!');
        const from = location.state?.from?.pathname || '/cart';
        navigate(from, { replace: true });
        return;
      }

      // 2) Otherwise, assume cookie/session — verify with /auth/me
      try {
        const me = await api.get('/auth/me');
        if (me?.data?.id) {
          toast.success('Login successful!');
          const from = location.state?.from?.pathname || '/cart';
          navigate(from, { replace: true });
          return;
        }
      } catch {
        // fallthrough to error below
      }

      // Neither token nor valid /auth/me → show a precise error
      throw new Error('Logged in response had no token and session could not be verified.');
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
