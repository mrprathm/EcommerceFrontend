import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) { navigate(`/products?search=${searchTerm}`); setSearchTerm(''); }
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-topbar">
        🎉 Free Shipping on orders above ₹499 &nbsp;|&nbsp; Use code: <strong>RATHOD10</strong> for 10% off
      </div>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrap">🛒</div>
          <div>
            <span className="logo-text">Rathod Store</span>
            <span className="logo-sub">Premium Shopping</span>
          </div>
        </Link>

        <div className="navbar-search">
          <form onSubmit={handleSearch}>
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search products, brands and more..." />
            <button type="submit">🔍 Search</button>
          </form>
        </div>

        <div className="navbar-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/products" className={isActive('/products')}>Products</Link>
          <Link to="/#about">About</Link>
          <Link to="/#contact">Contact</Link>
          {isAdmin() && <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''}>Admin</Link>}
        </div>

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <Link to="/cart" className="icon-btn cart-btn">
                🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/orders" className="icon-btn" title="My Orders">📦</Link>
              <div className="user-menu">
                <button className="user-avatar">{user.firstName?.charAt(0)}</button>
                <div className="user-dropdown">
                  <div className="user-info">
                    <strong>{user.firstName} {user.lastName}</strong>
                    <span>{user.email}</span>
                    <span className="role-badge">{user.role}</span>
                  </div>
                  <hr />
                  <Link to="/orders">📦 My Orders</Link>
                  {isAdmin() && <Link to="/admin">⚡ Admin Panel</Link>}
                  <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{padding:'8px 16px',fontSize:'13px'}}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{padding:'8px 16px',fontSize:'13px'}}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
