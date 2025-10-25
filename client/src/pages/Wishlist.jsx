import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { FiTrash } from 'react-icons/fi';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/wishlist')
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setItems(data);
        } else if (Array.isArray(data.products)) {
          setItems(data.products);
        }
      })
      .catch(err => {
        console.error('Failed to load wishlist', err);
      });
  }, []);

  const removeItem = async (id) => {
    try {
      await api.del('/api/wishlist/remove/' + id);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to remove item from wishlist', err);
    }
  };

  if (!localStorage.getItem('token')) {
    return <p style={{ padding: '1rem' }}>Please log in to view your wishlist.</p>;
  }

  return (
    <div className="wishlist-page" style={{ padding: '1rem' }}>
      <h2>My Wishlist</h2>
      {items.length === 0 ? (
        <p>No items saved yet.</p>
      ) : (
        <div className="wishlist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {items.map(item => (
            <div key={item._id} className="wishlist-item" style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '6px' }}>
              <img
                src={item.photoUrls?.[0] || 'https://via.placeholder.com/150'}
                alt={item.name}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px' }}
                onClick={() => navigate('/product/' + item._id)}
              />
              <h3 style={{ margin: '0.5rem 0' }}>{item.name}</h3>
              <p>Ksh {item.price?.toLocaleString()}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => navigate('/product/' + item._id)} style={{ flex: 1, marginRight: '0.5rem' }}>View</button>
                <button onClick={() => removeItem(item._id)} style={{ flex: 1 }}><FiTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
