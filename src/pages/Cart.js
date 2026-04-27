import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(null);

  const handleQty = async (itemId, qty) => {
    setUpdating(itemId);
    await updateQuantity(itemId, qty);
    setUpdating(null);
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="page-container">
          <div className="empty-state" style={{paddingTop:'120px'}}>
            <div style={{fontSize:'64px', marginBottom:'20px'}}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
            <Link to="/products" className="btn btn-primary" style={{marginTop:'24px'}}>
              Browse Products →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-container">
        <h1 className="section-title">🛒 Shopping Cart</h1>
        <p className="section-subtitle">{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} in your cart</p>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.cartItemId} className="cart-item">
                <div className="cart-item-image">
                  {item.productImageUrl ? <img src={item.productImageUrl} alt={item.productName} /> : <span>📦</span>}
                </div>
                <div className="cart-item-info">
                  <h4>{item.productName}</h4>
                  <p className="cart-item-price">₹{Number(item.unitPrice).toLocaleString('en-IN')}</p>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => handleQty(item.cartItemId, item.quantity - 1)} disabled={updating === item.cartItemId}>−</button>
                  <span>{updating === item.cartItemId ? '...' : item.quantity}</span>
                  <button onClick={() => handleQty(item.cartItemId, item.quantity + 1)} disabled={updating === item.cartItemId}>+</button>
                </div>
                <div className="cart-item-subtotal">₹{Number(item.subtotal).toLocaleString('en-IN')}</div>
                <button className="cart-remove-btn" onClick={() => removeFromCart(item.cartItemId)}>✕</button>
              </div>
            ))}
            <button className="btn btn-outline clear-cart-btn" onClick={clearCart}>🗑️ Clear Cart</button>
          </div>

          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{Number(cart.totalAmount).toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Shipping</span><span className="free">FREE</span></div>
            <div className="summary-row total"><span>Total</span><span>₹{Number(cart.totalAmount).toLocaleString('en-IN')}</span></div>
            <button className="btn btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn btn-outline" style={{justifyContent:'center',marginTop:'8px'}}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
