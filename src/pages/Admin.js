import React, { useEffect, useState } from 'react';
import { productAPI, categoryAPI, orderAPI } from '../services/api';
import './Admin.css';

const Admin = () => {
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({ name:'', description:'', price:'', stockQuantity:'', categoryId:'', imageUrl:'' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [pRes, cRes, oRes] = await Promise.all([
          productAPI.getAll(0, 100), categoryAPI.getAll(), orderAPI.getAll()
        ]);
        const prods = pRes.data.data?.content || [];
        const cats = cRes.data.data || [];
        const ords = oRes.data.data || [];
        setProducts(prods); setCategories(cats); setOrders(ords);
        setStats({
          products: prods.length, categories: cats.length, orders: ords.length,
          revenue: ords.reduce((s, o) => s + Number(o.totalAmount || 0), 0)
        });
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const data = { ...productForm, price: parseFloat(productForm.price), stockQuantity: parseInt(productForm.stockQuantity), categoryId: parseInt(productForm.categoryId) };
    try {
      if (editId) { await productAPI.update(editId, data); }
      else { await productAPI.create(data); }
      const res = await productAPI.getAll(0, 100);
      setProducts(res.data.data?.content || []);
      setShowProductForm(false); setEditId(null);
      setProductForm({ name:'', description:'', price:'', stockQuantity:'', categoryId:'', imageUrl:'' });
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await productAPI.delete(id);
    setProducts(products.filter(p => p.id !== id));
  };

  const handleStatusUpdate = async (orderId, status) => {
    await orderAPI.updateStatus(orderId, status);
    setOrders(orders.map(o => o.id === orderId ? {...o, status} : o));
  };

  if (loading) return <div className="admin-page"><div className="loading-spinner"><div className="spinner"></div>Loading...</div></div>;

  return (
    <div className="admin-page">
      <div className="page-container">
        <div className="admin-header">
          <h1 className="section-title">⚡ Admin Dashboard</h1>
          <p className="section-subtitle">Manage your store — Products, Orders & More</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total Products', value: stats.products, icon: '📦', color: '#6c63ff' },
            { label: 'Categories', value: stats.categories, icon: '🗂️', color: '#43e97b' },
            { label: 'Total Orders', value: stats.orders, icon: '🛒', color: '#ff6584' },
            { label: 'Total Revenue', value: `₹${Number(stats.revenue).toLocaleString('en-IN')}`, icon: '💰', color: '#f9ca24' },
          ].map((s, i) => (
            <div key={i} className="stat-card card">
              <div className="stat-icon" style={{background:`${s.color}20`, color:s.color}}>{s.icon}</div>
              <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {['dashboard','products','orders'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'dashboard' ? '📊 Overview' : t === 'products' ? '📦 Products' : '🛒 Orders'}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          <div className="tab-content">
            <div className="tab-header">
              <h3>Products ({products.length})</h3>
              <button className="btn btn-primary" onClick={() => { setShowProductForm(!showProductForm); setEditId(null); setProductForm({ name:'', description:'', price:'', stockQuantity:'', categoryId:'', imageUrl:'' }); }}>
                + Add Product
              </button>
            </div>
            {showProductForm && (
              <div className="product-form card">
                <h4>{editId ? 'Edit Product' : 'Add New Product'}</h4>
                <form onSubmit={handleProductSubmit} className="admin-form">
                  <div className="form-row">
                    <div className="form-group"><label>Product Name</label><input value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})} required placeholder="Product name" /></div>
                    <div className="form-group"><label>Category</label><select value={productForm.categoryId} onChange={e=>setProductForm({...productForm,categoryId:e.target.value})} required><option value="">Select Category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  </div>
                  <div className="form-group"><label>Description</label><textarea value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})} rows={2} placeholder="Product description" /></div>
                  <div className="form-row">
                    <div className="form-group"><label>Price (₹)</label><input type="number" step="0.01" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})} required placeholder="999" /></div>
                    <div className="form-group"><label>Stock Qty</label><input type="number" value={productForm.stockQuantity} onChange={e=>setProductForm({...productForm,stockQuantity:e.target.value})} required placeholder="50" /></div>
                  </div>
                  <div className="form-group"><label>Image URL</label><input value={productForm.imageUrl} onChange={e=>setProductForm({...productForm,imageUrl:e.target.value})} placeholder="https://example.com/image.jpg" /></div>
                  <div style={{display:'flex',gap:'10px'}}>
                    <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Add Product'}</button>
                    <button type="button" className="btn btn-outline" onClick={() => setShowProductForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td><strong>{p.name}</strong></td>
                      <td><span className="badge badge-purple">{p.categoryName}</span></td>
                      <td>₹{Number(p.price).toLocaleString('en-IN')}</td>
                      <td><span className={p.stockQuantity > 0 ? 'in-stock' : 'no-stock'}>{p.stockQuantity}</span></td>
                      <td>
                        <div style={{display:'flex',gap:'8px'}}>
                          <button className="btn btn-outline" style={{padding:'6px 12px',fontSize:'12px'}} onClick={() => { setEditId(p.id); setProductForm({name:p.name,description:p.description||'',price:p.price,stockQuantity:p.stockQuantity,categoryId:p.categoryId,imageUrl:p.imageUrl||''}); setShowProductForm(true); }}>Edit</button>
                          <button className="btn btn-danger" style={{padding:'6px 12px',fontSize:'12px'}} onClick={() => handleDelete(p.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="tab-content">
            <h3>All Orders ({orders.length})</h3>
            <div className="admin-table-wrapper" style={{marginTop:'20px'}}>
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Update</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.userEmail}</td>
                      <td>₹{Number(o.totalAmount).toLocaleString('en-IN')}</td>
                      <td><span className={`badge ${o.status==='DELIVERED'?'badge-green':o.status==='CANCELLED'?'badge-red':'badge-purple'}`}>{o.status}</span></td>
                      <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <select value={o.status} onChange={e=>handleStatusUpdate(o.id,e.target.value)} className="status-select">
                          {['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'].map(s=><option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'dashboard' && (
          <div className="tab-content">
            <h3>Recent Orders</h3>
            <div className="recent-orders">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="recent-order-item card">
                  <span>Order #{o.id}</span>
                  <span>{o.userEmail}</span>
                  <span className={`badge ${o.status==='DELIVERED'?'badge-green':o.status==='CANCELLED'?'badge-red':'badge-purple'}`}>{o.status}</span>
                  <span style={{color:'var(--accent)',fontWeight:'700'}}>₹{Number(o.totalAmount).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
