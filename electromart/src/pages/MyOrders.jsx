import React, { useEffect, useState } from 'react';
import './MyOrders.css'; // ⬅️ Add this

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch orders');

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2>📦 My Orders</h2>
      {orders.length === 0 ? (
        <p>You haven’t placed any orders yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Items</th>
              <th>Total Cost</th>
              <th>Payment Method</th>
              <th>Placed On</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td>{order.totalItems}</td>
                <td>Ksh {order.totalCost}</td>
                <td>{order.paymentMethod}</td>
                <td>{new Date(order.date || order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
