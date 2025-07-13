// src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/orders/admin');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🧾 All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Email</th>
              <th>Total</th>
              <th>Items</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td>{order.customerEmail}</td>
                <td>Ksh {order.totalCost}</td>
                <td>{order.totalItems}</td>
                <td>{order.paymentStatus}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
