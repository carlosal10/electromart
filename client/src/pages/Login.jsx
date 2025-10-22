// File: client/src/pages/Login.jsx
// Purpose: add hard diagnostics for /login response shape and ensure token is extracted from JSON.

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../utils/api';

const extractTokenDeep = (obj, seen = new Set()) => {
  if (!obj || typeof obj !== 'object' || seen.has(obj)) return null;
  seen.add(obj);
  for (const [k, v] of Object.entries(obj)) {
    const key = String(k).toLowerCase();
    if (['token', 'access_token', 'accesstoken', 'jwt'].includes(key) && typeof v === 'string') return v;
  }
  const nests = ['data', 'result', 'payload', 'user', 'auth', 'response'];
  for (const n of nests) { if (obj[n]) { const t = extractTokenDeep(obj[n], seen); if (t) return t; } }
  for (const v of Object.values(obj)) { if (v && typeof v === 'object') { const t = extractTokenDeep(v, seen); if (t) return t; } }
  return null;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.emailOrPhone.trim()) return 'Email or phone is required';
    if (!form.password) return 'Password is required';
    return null;
  };

  const afterAuth = (role = 'user') => {
    const fromPath = location.state?.from?.pathname || '';
    if ((location.pathname.startsWith('/admin') || fromPath.startsWith('/admin')) && role !== 'admin') {
      toast.error('Admins only.');
      navigate('/forbidden', { replace: true, state: { from: location } });
      return;
    }
    navigate(role === 'admin' ? '/admin' : (fromPath && !fromPath.startsWith('/admin') ? fromPath : '/cart'), { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.warn(err); return; }
    setLoading(true);

    try {
      // Correct call with body (above try just to ensure no stale code remains):
      const loginResp = await api.post('/api/auth/login', {
        emailOrPhone: form.emailOrPhone.trim(),
        password: form.password,
      });

      // Dev diagnostics for this exact issue
      if (process.env.NODE_ENV !== 'production') {
        const r = loginResp || {};
        const data = r.data;
        console.info('[login] diagnostics:',
          { url: '/api/auth/login', gotKeys: data ? Object.keys(data) : [], sample: JSON.stringify(data)?.slice(0, 200) });
      }

      const serverJson = loginResp?.data ?? {};
      const token = serverJson.token || extractTokenDeep(serverJson);
      if (!token) {
        const keys = Object.keys(serverJson || []);
        throw new Error(
          `Login succeeded but no token returned. Keys: [${keys.join(', ')}].` +
          ` Check API base URL and Content-Type (must be application/json).`
        );
      }
      localStorage.setItem('token', token);

      // Verify session
      const me = await api.get('/api/auth/me', { authToken: token });
      const p = me?.data || {};
      const userId = p.id || p._id || p.userId || p.user?.id || p.user?._id;
      if (!userId) throw new Error('Could not verify session after login.');
      const role = p.role ?? p.user?.role ?? 'user';
      toast.success('Login successful!');
      afterAuth(role);
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
        <input name="emailOrPhone" type="text" placeholder="Email or Phone" value={form.emailOrPhone} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <button type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
      </form>
    </div>
  );
}
