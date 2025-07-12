import React, { useEffect, useState } from 'react';
import './styles.css';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/orders/my-orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setOrders)
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load orders');
      });
  }, []);

  return (
    <div className="order-history">
      <h2>📜 My Orders</h2>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Total:</strong> Ksh {order.totalCost}</p>
            <p><strong>Status:</strong> Completed</p>
            <p><strong>Payment:</strong> {order.paymentMethod}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>{item.name} × {item.quantity}</li>
              ))}
            </ul>
            <button>🧾 Download Invoice</button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
