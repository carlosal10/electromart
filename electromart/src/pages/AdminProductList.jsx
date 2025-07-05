import React, { useEffect, useState } from 'react';
import './admin-products.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products.');
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`https://ecommerce-electronics-0j4e.onrender.com/api/products/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      toast.success('Product deleted!');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Error deleting product');
    }
  };

  return (
    <section className="admin-products-section">
      <ToastContainer />
      <h2>Product Inventory</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price (Ksh)</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id}>
                  <td>
                    <img
                      src={prod.photoUrl || 'https://via.placeholder.com/60'}
                      alt={prod.name}
                      style={{ width: '60px', borderRadius: '6px' }}
                    />
                  </td>
                  <td>{prod.name}</td>
                  <td>{prod.price}</td>
                  <td>{prod.stock}</td>
                  <td>{prod.category}</td>
                  <td>
                    <button
                      className="btn-small edit"
                      onClick={() => navigate(`/admin/edit-product/${prod._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-small delete"
                      onClick={() => handleDelete(prod._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminProductList;
