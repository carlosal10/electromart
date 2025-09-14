import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdShoppingCart,
  MdPeople,
  MdListAlt,
  MdAddCircle
} from 'react-icons/md'; // or use lucide icons
import './AdminDashboard.css';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li className={location.pathname === '/admin/overview' ? 'active' : ''}>
              <Link to="/admin/overview">
                <MdDashboard size={18} style={{ marginRight: 8 }} />
                Overview
              </Link>
            </li>
            <li className={location.pathname === '/admin/orders' ? 'active' : ''}>
              <Link to="/admin/orders">
                <MdListAlt size={18} style={{ marginRight: 8 }} />
                Orders
              </Link>
            </li>
            <li className={location.pathname === '/admin/products' ? 'active' : ''}>
              <Link to="/admin/products">
                <MdShoppingCart size={18} style={{ marginRight: 8 }} />
                Products
              </Link>
            </li>
            <li className={location.pathname === '/admin/users' ? 'active' : ''}>
              <Link to="/admin/users">
                <MdPeople size={18} style={{ marginRight: 8 }} />
                Users
              </Link>
            </li>
            <li className={location.pathname === '/admin/data-entry' ? 'active' : ''}>
              <Link to="/admin/data-entry">
                <MdAddCircle size={18} style={{ marginRight: 8 }} />
                Data Entry
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
