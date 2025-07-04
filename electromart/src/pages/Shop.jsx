import React, { useState, useEffect } from 'react';
import './shop.css';

const Shop = () => {
  const API_URL = 'https://ecommerce-electronics-0j4e.onrender.com/api/products';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxPriceLimit, setMaxPriceLimit] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch products.');

        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(prod => prod.category).filter(Boolean))];
        setCategories(uniqueCategories);

        // Determine highest price
        const highest = Math.max(...data.map(prod => prod.price));
        setMaxPrice(highest);
        setMaxPriceLimit(highest);
      } catch (err) {
        setError('Error loading products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Apply filters when category, searchTerm, or maxPrice changes
  useEffect(() => {
    const filtered = products.filter(product =>
      (category === '' || product.category === category) &&
      (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!isNaN(maxPrice) && product.price <= maxPrice)
    );

    setFilteredProducts(filtered);
  }, [category, searchTerm, maxPrice, products]);

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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="searchFilter">Search Name</label>
          <input
            type="text"
            id="searchFilter"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g. Samsung S22"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="priceFilter">
            Max Price: <strong>Ksh {maxPrice.toLocaleString()}</strong>
          </label>
          <input
            type="range"
            id="priceFilter"
            min="0"
            max={maxPriceLimit}
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
                <p>Ksh {product.price.toLocaleString()}</p>
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
