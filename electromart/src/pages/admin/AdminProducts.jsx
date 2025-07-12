// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://ecommerce-electronics-0j4e.onrender.com/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Product fetch failed:', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📦 Manage Products</h2>
      <Link to="/add-product">➕ Add New Product</Link>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>In Stock</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>Ksh {product.price}</td>
                <td>{product.inStock ? 'Yes' : 'No'}</td>
                <td>
                  <Link to={`/admin/edit-product/${product._id}`}>✏️ Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProducts;
