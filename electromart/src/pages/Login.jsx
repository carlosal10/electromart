import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      navigate('/cart');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ToastContainer />
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Email or Phone"
          value={form.emailOrPhone}
          onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
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
