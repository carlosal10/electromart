import React, { useState, useEffect } from 'react';
import './shop.css'; // Optional: import shop-specific styles if needed

const Shop = () => {
  const API_URL = 'https://ecommerce-electronics-0j4e.onrender.com/api/products';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch products.');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Error loading products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      return (
        (category === '' || product.category === category) &&
        (brand === '' || product.brand === brand) &&
        (isNaN(maxPrice) || product.price <= maxPrice)
      );
    });

    setFilteredProducts(filtered);
  }, [category, brand, maxPrice, products]);

  return (
    <main className="shop-container">
      <aside className="filters">
        <h3>Filters</h3>

        <div className="filter-group">
          <label htmlFor="categoryFilter">Category</label>
          <select
            id="categoryFilter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="Phones">Phones</option>
            <option value="Laptops">Laptops</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="brandFilter">Brand</label>
          <select
            id="brandFilter"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="">All</option>
            <option value="Samsung">Samsung</option>
            <option value="Apple">Apple</option>
            <option value="Dell">Dell</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priceFilter">
            Max Price: <span>{maxPrice}</span>
          </label>
          <input
            type="range"
            id="priceFilter"
            min="0"
            max="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
          />
        </div>
      </aside>

      <section className="products">
        <h2>All Products</h2>
        <div className="product-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-img">
                  <img
                    src={product.photoUrl || 'https://via.placeholder.com/150x150?text=No+Image'}
                    alt={product.name}
                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                  />
                </div>
                <h3>{product.name}</h3>
                <p>Ksh {product.price}</p>
                <button className="btn-red">Add to Cart</button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Shop;
