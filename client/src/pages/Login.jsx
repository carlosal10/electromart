// File: src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../utils/api';
import './auth.css';

// Recursively search for a token-like field
const extractTokenDeep = (obj, seen = new Set()) => {
  if (!obj || typeof obj !== 'object') return null;
  if (seen.has(obj)) return null;
  seen.add(obj);

  // Normalize keys for robust matching
  for (const [k, v] of Object.entries(obj)) {
    const key = String(k).toLowerCase();
    if (['token', 'access_token', 'accesstoken', 'jwt'].includes(key) && typeof v === 'string') {
      return v;
    }
  }
  // Common nests
  const candidates = ['data', 'result', 'payload', 'user', 'auth', 'response'];
  for (const c of candidates) {
    if (obj[c]) {
      const t = extractTokenDeep(obj[c], seen);
      if (t) return t;
    }
  }
  // Fallback: deep scan
  for (const v of Object.values(obj)) {
    if (v && typeof v === 'object') {
      const t = extractTokenDeep(v, seen);
      if (t) return t;
    }
  }
  return null;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const fromPath = location.state?.from?.pathname || '';
  const isAdminContext =
    location.pathname.startsWith('/admin') || fromPath.startsWith('/admin');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.emailOrPhone.trim()) return 'Email or phone is required';
    if (!form.password) return 'Password is required';
    return null;
  };

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
      // 1) Login -> get token (shape may vary depending on backend or proxy)
      const loginResp = await api.post('/api/auth/login', {
        emailOrPhone: form.emailOrPhone.trim(),
        password: form.password,
      });

      // Helpful diagnostics in dev
      if (process.env.NODE_ENV !== 'production') {
        console.info('[login] raw /login response object:', loginResp);
        console.info('[login] top-level keys:', Object.keys(loginResp || {}));
        console.info('[login] data keys:', loginResp?.data ? Object.keys(loginResp.data) : '(no data)');
      }

      // Our fetch wrapper returns { data: <server JSON> }
      const serverJson = loginResp?.data ?? {};
      const token =
        serverJson.token ||
        extractTokenDeep(serverJson); // tolerant extraction

      if (!token) {
        const topLevelKeys = Object.keys(serverJson || {});
        throw new Error(
          `Login succeeded but no token returned. Keys: [${topLevelKeys.join(', ')}]. ` +
          `Expected "token" or similar (accessToken/jwt).`
        );
      }

      localStorage.setItem('token', token);

      // 2) Verify session with proper Bearer header
      const me = await api.get('/api/auth/me', { authToken: token });

      if (process.env.NODE_ENV !== 'production') {
        console.info('[login] /me response:', me);
      }

      const profile = me?.data || {};
      const userId = profile.id || profile._id || profile.userId || profile.user?.id || profile.user?._id || null;
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
