import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export const Checkout = () => {
  const [form, setForm] = useState({ shippingAddress: '', paymentMethod: 'COD' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await orderAPI.place(form);
      setOrderId(res.data.data?.id);
      setSuccess(true);
      await clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="checkout-page">
        <div className="success-card card">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Your order #{orderId} has been confirmed.</p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>Track Orders →</button>
            <button className="btn btn-outline" onClick={() => navigate('/products')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="page-container">
        <h1 className="section-title">💳 Checkout</h1>
        <div className="checkout-layout">
          <div className="checkout-form card">
            <h3>Shipping & Payment</h3>
            {error && <div className="auth-error">⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Shipping Address</label>
                <textarea rows={3} placeholder="Enter your full address..." value={form.shippingAddress}
                  onChange={e => setForm({...form, shippingAddress: e.target.value})} required style={{resize:'vertical'}} />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}>
                  <option value="COD">Cash on Delivery</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Credit/Debit Card</option>
                  <option value="NETBANKING">Net Banking</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary checkout-btn" disabled={loading}>
                {loading ? 'Placing Order...' : '🎉 Place Order →'}
              </button>
            </form>
          </div>
          <div className="order-summary card">
            <h3>Order Summary</h3>
            {cart?.items?.map(item => (
              <div key={item.cartItemId} className="summary-item">
                <span>{item.productName} × {item.quantity}</span>
                <span>₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="summary-total">
              <strong>Total</strong>
              <strong style={{color:'var(--accent)'}}>₹{Number(cart?.totalAmount || 0).toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
