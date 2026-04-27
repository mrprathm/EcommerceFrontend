import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const FALLBACK_IMGS = {
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
  'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
  'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
  'Books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
  'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { window.location.href = '/login'; return; }
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {}
    setAdding(false);
  };

  const imgSrc = (!imgError && product.imageUrl)
    ? product.imageUrl
    : FALLBACK_IMGS[product.categoryName] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';

  const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        <img src={imgSrc} alt={product.name} onError={() => setImgError(true)} loading="lazy" />
        <div className="product-category-badge">{product.categoryName}</div>
        {product.stockQuantity === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
        {product.stockQuantity > 0 && product.stockQuantity <= 10 && (
          <div className="low-stock-badge">Only {product.stockQuantity} left!</div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <div className="product-price">{formatPrice(product.price)}</div>
          <div>{product.stockQuantity > 0 ? <span className="in-stock">✓ In Stock</span> : <span className="no-stock">✗ Out</span>}</div>
        </div>
        <button className={`add-to-cart-btn ${added ? 'added' : ''}`} onClick={handleAddToCart} disabled={adding || product.stockQuantity === 0}>
          {added ? '✓ Added to Cart!' : adding ? 'Adding...' : '🛒 Add to Cart'}
        </button>
      </div>
    </Link>
  );
};
export default ProductCard;
