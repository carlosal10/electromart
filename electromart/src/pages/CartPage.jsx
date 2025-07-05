import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import './styles.css';
import 'react-toastify/dist/ReactToastify.css';

const useCart = () => useContext(CartContext);

const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalCost,
    orderId
  } = useCart();

  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [form, setForm] = useState({
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'mpesa'
  });

  const isLoggedIn = !!localStorage.getItem('token'); // Or however you track login

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      toast.info('Please login or signup to complete checkout.');
      return navigate('/login');
    }
    setShowCheckout(true);
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      orderId,
      items: cart,
      totalItems,
      totalCost,
      customerEmail: form.email,
      customerPhone: form.phone,
      deliveryAddress: form.address,
      paymentMethod: form.paymentMethod
    };

    try {
      const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error('Failed to save order');
      const data = await res.json();
      setPaymentComplete(true);
      clearCart();
      toast.success('✅ Order placed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="cart-page">
      <ToastContainer />
      <h2>Your Cart</h2>

      {paymentComplete ? (
        <>
          <h3>✅ Order Confirmed</h3>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Delivery Method:</strong> {form.paymentMethod === 'cod' ? 'Cash on Delivery' : 'M-Pesa STK Push'}</p>
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Phone:</strong> {form.phone}</p>
          <p><strong>Address:</strong> {form.address}</p>
          <p><strong>Expected Delivery:</strong> Within 2–3 working days</p>
          <button onClick={() => navigate('/shop')}>🛒 Back to Shop</button>
        </>
      ) : cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <p><strong>Order ID:</strong> {orderId}</p>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Specs</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={item.photoUrl || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      style={{ width: '60px', borderRadius: '6px' }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>
                    <small><strong>Features:</strong> {item.features}</small><br />
                    <small><strong>Description:</strong> {item.description}</small>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => updateQuantity(item._id, +e.target.value)}
                    />
                  </td>
                  <td>Ksh {item.price}</td>
                  <td>Ksh {item.price * item.quantity}</td>
                  <td>
                    <button onClick={() => removeFromCart(item._id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <p><strong>Total Items:</strong> {totalItems}</p>
            <p><strong>Total Cost:</strong> Ksh {totalCost}</p>
            {!showCheckout ? (
              <>
                <button onClick={handleCheckoutClick}>Proceed to Checkout</button>
                <button onClick={clearCart} style={{ marginLeft: '1rem' }}>Clear Cart</button>
              </>
            ) : (
              <div className="checkout-form">
                <h3>Checkout Details</h3>
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Residential Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                >
                  <option value="mpesa">Pay via M-Pesa</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
                <button onClick={handlePlaceOrder}>Place Order</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
