import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiTruck, FiShoppingCart, FiHeart, FiX } from 'react-icons/fi';
import './ProductDetail.css';

const fallbackImage = '/images/fallback.jpg';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [zoomed, setZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://ecommerce-electronics-0j4e.onrender.com/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setMainImage(data.photoUrls?.[0] || fallbackImage);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const res = await fetch('https://ecommerce-electronics-0j4e.onrender.com/api/products?limit=6');
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
    };

    fetchProduct();
    fetchSuggestions();
  }, [id]);

  const handleAddToCart = () => {
    console.log('🛒 Add to cart', { id, selectedColor, selectedSize });
  };

  const handleImageClick = (url) => {
    setMainImage(url);
  };

  if (loading) return <p className="loading">Loading product...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="product-detail-container">
      {/* 🔍 Image Zoom Overlay */}
      {zoomed && (
        <div className="zoom-overlay" onClick={() => setZoomed(false)}>
          <div className="zoom-content" onClick={(e) => e.stopPropagation()}>
            <button className="zoom-close" onClick={() => setZoomed(false)}>
              <FiX size={24} />
            </button>
            <img src={mainImage} alt="Zoom" className="zoomed-image" />
          </div>
        </div>
      )}

      <div className="product-detail-main">
        <div className="product-image-section">
          <div className="main-image-wrapper">
            <img
              src={mainImage}
              alt={product.name}
              className="main-image"
              onError={(e) => (e.target.src = fallbackImage)}
              onClick={() => setZoomed(true)}
            />
            <button className="wishlist-btn" title="Add to wishlist">
              <FiHeart size={20} />
            </button>
          </div>

          <div className="thumbnail-strip">
            {product.photoUrls?.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`thumb-${i}`}
                onClick={() => handleImageClick(url)}
                className={`thumbnail ${mainImage === url ? 'active' : ''}`}
                onError={(e) => (e.target.src = fallbackImage)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">Ksh {product.price.toLocaleString()}</p>
          {product.originalPrice && product.discount && (
            <p className="discount">
              Was Ksh {product.originalPrice.toLocaleString()} – Save {product.discount}%
            </p>
          )}
          <p className={`stock ${product.inStock ? 'in' : 'out'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </p>

          <p className="description">{product.description}</p>

          {product.features && (
            <div className="specs">
              <h4>Specifications</h4>
              <ul>
                {product.features.split('\n').map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="variation">
              <label>Color:</label>
              <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                <option value="">Select</option>
                {product.colors.map((color, idx) => (
                  <option key={idx} value={color}>{color}</option>
                ))}
              </select>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="variation">
              <label>Size:</label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                <option value="">Select</option>
                {product.sizes.map((size, idx) => (
                  <option key={idx} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}

          {product.freeShipping && (
            <div className="shipping-badge">
              <FiTruck size={18} /> Free Shipping Available
            </div>
          )}

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <FiShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </div>

      <div className="product-suggestions">
        <h3>Other Products You May Like</h3>
        <div className="suggestion-grid">
          {suggestions.map((s) => (
            <Link to={`/products/${s._id}`} key={s._id} className="suggestion-card">
              <img
                src={s.photoUrls?.[0] || fallbackImage}
                alt={s.name}
                onError={(e) => (e.target.src = fallbackImage)}
              />
              <h4>{s.name}</h4>
              <p>Ksh {s.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
