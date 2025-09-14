import React from 'react';
import { FiUsers } from 'react-icons/fi';

const AdminUsers = () => {
  return (
    <div className="admin-placeholder">
      <FiUsers size={32} />
      <h2>Admin Users</h2>
      <p>This is where you manage registered users.</p>
    </div>
  );
};

export default AdminUsers;
