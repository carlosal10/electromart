import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext'; // ✅ Correct context path
import './cart.css';
import './styles.css';

// ✅ Hook to extract from context
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

  const handleCheckout = () => {
    const order = {
      orderId,
      date: new Date().toISOString(),
      items: cart,
      totalItems,
      totalCost
    };

    console.log("Order Data:", order);
    // ✅ Optional: POST to backend if you want to save the order
    // fetch('/api/orders', { method: 'POST', body: JSON.stringify(order), headers: { 'Content-Type': 'application/json' } })
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <p><strong>Order ID:</strong> {orderId}</p>
          <table>
            <thead>
              <tr>
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
                  <td><button onClick={() => removeFromCart(item._id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <p><strong>Total Items:</strong> {totalItems}</p>
            <p><strong>Total Cost:</strong> Ksh {totalCost}</p>
            <button onClick={handleCheckout}>Proceed to Checkout</button>
            <button onClick={clearCart} style={{ marginLeft: '1rem' }}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
