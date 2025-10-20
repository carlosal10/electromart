// src/admin/AdminRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { api } from '../utils/api';

/**
 * AdminRoute: Protects admin-only pages
 * - Verifies JWT token by calling /auth/me
 * - Redirects to /login if unauthenticated
 * - Redirects to /forbidden if not an admin
 * - Works for both wrapper and nested <Route> usage
 */
const AdminRoute = ({ children }) => {
  const [state, setState] = useState({ loading: true, allowed: false, authed: false });
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api.get('/auth/me'); // server verifies token & returns {role}
        if (!cancelled) {
          const authed = !!data?.id;
          const allowed = data?.role === 'admin';
          setState({ loading: false, authed, allowed });
        }
      } catch {
        if (!cancelled) setState({ loading: false, authed: false, allowed: false });
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Still verifying token
  if (state.loading) return null; // you can render a spinner if desired

  // Not logged in → go to login
  if (!state.authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logged in but not admin → forbidden
  if (!state.allowed) {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  // OK → render admin content
  return children ?? <Outlet />;
};

export default AdminRoute;
