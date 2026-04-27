import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import './Orders.css';

const statusColors = {
  PENDING: 'badge-purple', CONFIRMED: 'badge-green',
  SHIPPED: 'badge-purple', DELIVERED: 'badge-green', CANCELLED: 'badge-red'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(r => setOrders(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="orders-page"><div className="loading-spinner"><div className="spinner"></div>Loading orders...</div></div>;

  return (
    <div className="orders-page">
      <div className="page-container">
        <h1 className="section-title">📦 My Orders</h1>
        <p className="section-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        {orders.length === 0 ? (
          <div className="empty-state"><h3>No orders yet</h3><p>Place your first order!</p></div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card card">
                <div className="order-header">
                  <div>
                    <span className="order-id">Order #{order.id}</span>
                    <span className={`badge ${statusColors[order.status] || 'badge-purple'}`}>{order.status}</span>
                  </div>
                  <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</div>
                </div>
                <div className="order-items">
                  {order.orderItems?.map((item, i) => (
                    <div key={i} className="order-item">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <div className="order-meta">
                    <span>📍 {order.shippingAddress}</span>
                    <span>💳 {order.paymentMethod}</span>
                  </div>
                  <div className="order-total">₹{Number(order.totalAmount).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
