import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const BANNERS = [
  { bg: 'linear-gradient(135deg, #1a0a00 0%, #3d1f00 50%, #1a0a00 100%)', badge: '🔥 Hot Deals', title: 'Summer Sale is LIVE!', sub: 'Up to 70% off on Electronics & Fashion', btn: 'Shop Now', img: '🖥️', color: '#d4a843' },
  { bg: 'linear-gradient(135deg, #000a1a 0%, #001f3d 50%, #000a1a 100%)', badge: '⚡ New Arrivals', title: 'Latest Gadgets 2024', sub: 'Explore the newest tech at best prices', btn: 'Explore', img: '📱', color: '#4fc3f7' },
  { bg: 'linear-gradient(135deg, #0a001a 0%, #1f003d 50%, #0a001a 100%)', badge: '👗 Fashion Week', title: 'Style Redefined', sub: 'Premium fashion collection now available', btn: 'View Collection', img: '👠', color: '#ce93d8' },
];

const SERVICES = [
  { icon: '🚀', title: 'Express Delivery', desc: 'Same day delivery available in select cities', color: '#d4a843' },
  { icon: '🔒', title: 'Secure Payments', desc: 'SSL encrypted & multiple payment options', color: '#4fc3f7' },
  { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free return policy', color: '#81c784' },
  { icon: '🎧', title: '24/7 Support', desc: 'Round the clock customer assistance', color: '#ce93d8' },
  { icon: '✅', title: '100% Genuine', desc: 'All products are authentic & quality tested', color: '#ff8a65' },
  { icon: '💰', title: 'Best Prices', desc: 'Price match guarantee on all products', color: '#4db6ac' },
];

const ORDER_STATUSES = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(0);
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setBanner(b => (b + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#about') aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (hash === '#contact') contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    Promise.all([productAPI.getAll(0, 8), categoryAPI.getAll()])
      .then(([p, c]) => { setProducts(p.data.data?.content || []); setCategories(c.data.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    const step = Math.floor(Math.random() * ORDER_STATUSES.length);
    setTrackResult({ id: trackId, step, status: ORDER_STATUSES[step] });
  };

  const catIcons = { 'Electronics': '💻', 'Fashion': '👗', 'Home & Kitchen': '🏠', 'Books': '📚', 'Sports': '⚽' };
  const catColors = { 'Electronics': '#4fc3f7', 'Fashion': '#ce93d8', 'Home & Kitchen': '#81c784', 'Books': '#ffb74d', 'Sports': '#ff8a65' };

  const b = BANNERS[banner];

  return (
    <div className="home">
      {/* ===== HERO BANNER SLIDER ===== */}
      <section className="hero-banner" style={{ background: b.bg }}>
        <div className="hero-particles">
          {[...Array(8)].map((_, i) => <div key={i} className={`particle p${i}`}></div>)}
        </div>
        <div className="page-container hero-inner">
          <div className="hero-text">
            <span className="hero-badge" style={{ background: `${b.color}22`, color: b.color, border: `1px solid ${b.color}44` }}>{b.badge}</span>
            <h1 className="hero-title">{b.title}</h1>
            <p className="hero-sub">{b.sub}</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary hero-btn">{b.btn} →</Link>
              <Link to="/register" className="btn btn-outline hero-btn">Join Free</Link>
            </div>
            <div className="hero-trust">
              <span>✅ 10,000+ Happy Customers</span>
              <span>🔒 100% Secure</span>
              <span>🚀 Fast Delivery</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-wrap" style={{ boxShadow: `0 0 80px ${b.color}30` }}>
              <span className="hero-emoji">{b.img}</span>
            </div>
          </div>
        </div>
        <div className="banner-dots">
          {BANNERS.map((_, i) => (
            <button key={i} className={`dot ${i === banner ? 'active' : ''}`} onClick={() => setBanner(i)} />
          ))}
        </div>
      </section>

      {/* ===== QUICK STATS BAR ===== */}
      <div className="stats-bar">
        <div className="page-container stats-inner">
          {[['10+', 'Products'], ['5', 'Categories'], ['500+', 'Orders'], ['4.9★', 'Rating']].map(([v, l]) => (
            <div key={l} className="stat-item"><strong>{v}</strong><span>{l}</span></div>
          ))}
        </div>
      </div>

      {/* ===== CATEGORIES ===== */}
      <section className="section page-container">
        <div className="section-head">
          <h2 className="section-title">🗂️ Shop by Category</h2>
          <p className="section-subtitle">Find exactly what you're looking for</p>
        </div>
        <div className="cat-grid">
          {categories.map(cat => (
            <button key={cat.id} className="cat-card" onClick={() => navigate(`/products?category=${cat.id}&name=${cat.name}`)}>
              <div className="cat-img-wrap">
                {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} onError={e => e.target.style.display='none'} /> : null}
                <span className="cat-overlay-icon">{catIcons[cat.name] || '🛍️'}</span>
              </div>
              <span className="cat-name">{cat.name}</span>
              <span className="cat-desc">{cat.description}</span>
            </button>
          ))}
          <button className="cat-card cat-all" onClick={() => navigate('/products')}>
            <div className="cat-icon-wrap" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}>
              <span className="cat-emoji">🛍️</span>
            </div>
            <span className="cat-name">View All</span>
            <span className="cat-desc">Browse everything</span>
          </button>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section page-container">
        <div className="section-head-row">
          <div>
            <h2 className="section-title">⭐ Featured Products</h2>
            <p className="section-subtitle">Handpicked best sellers just for you</p>
          </div>
          <Link to="/products" className="btn btn-outline">View All →</Link>
        </div>
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div> Loading...</div>
        ) : (
          <div className="grid-products">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="promo-section page-container">
        <div className="promo-grid">
          <div className="promo-card promo-big" onClick={() => navigate('/products?category=1&name=Electronics')}>
            <span className="promo-badge">Up to 50% Off</span>
            <h3>Electronics Sale</h3>
            <p>Laptops, Phones & Gadgets</p>
            <span className="promo-cta">Shop Now →</span>
            <span className="promo-bg-icon">💻</span>
          </div>
          <div className="promo-small-col">
            <div className="promo-card promo-sm" onClick={() => navigate('/products?category=2&name=Fashion')}>
              <span className="promo-badge">New Arrivals</span>
              <h3>Fashion</h3>
              <p>Latest trends</p>
              <span className="promo-bg-icon">👗</span>
            </div>
            <div className="promo-card promo-sm promo-gold" onClick={() => navigate('/products?category=4&name=Books')}>
              <span className="promo-badge">Best Sellers</span>
              <h3>Books</h3>
              <p>Knowledge is power</p>
              <span className="promo-bg-icon">📚</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="section page-container">
        <h2 className="section-title">💎 Why Rathod Store?</h2>
        <p className="section-subtitle">We go above and beyond for our customers</p>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-icon" style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ORDER TRACKER ===== */}
      <section className="section page-container" id="track">
        <div className="tracker-wrap">
          <div className="tracker-left">
            <h2 className="section-title">📦 Track Your Order</h2>
            <p className="section-subtitle">Enter your order ID to get real-time status</p>
            <form onSubmit={handleTrack} className="tracker-form">
              <input value={trackId} onChange={e => setTrackId(e.target.value)} placeholder="Enter Order ID (e.g. 101)" />
              <button type="submit" className="btn btn-primary">Track →</button>
            </form>
            {trackResult && (
              <div className="track-result">
                <p className="track-id">Order <strong>#{trackResult.id}</strong></p>
                <div className="track-steps">
                  {ORDER_STATUSES.map((s, i) => (
                    <div key={i} className={`track-step ${i <= trackResult.step ? 'done' : ''} ${i === trackResult.step ? 'current' : ''}`}>
                      <div className="step-dot">{i <= trackResult.step ? '✓' : i + 1}</div>
                      <span>{s}</span>
                      {i < ORDER_STATUSES.length - 1 && <div className="step-line"></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="tracker-right">
            <div className="tracker-img">📦</div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="section about-section" id="about" ref={aboutRef}>
        <div className="page-container">
          <div className="about-grid">
            <div className="about-left">
              <span className="about-badge">About Us</span>
              <h2 className="section-title" style={{ marginBottom: '16px' }}>About Rathod Store</h2>
              <p>Rathod Store is a premier e-commerce platform founded by <strong>Pratham Rathod</strong> — a passionate Full Stack Java Developer from Pune, Maharashtra.</p>
              <p style={{ marginTop: '12px' }}>Our mission is to provide customers with the best shopping experience — from premium products to lightning-fast delivery and exceptional customer support.</p>
              <div className="about-stats">
                <div className="ab-stat"><strong>500+</strong><span>Happy Customers</span></div>
                <div className="ab-stat"><strong>10+</strong><span>Products</span></div>
                <div className="ab-stat"><strong>5</strong><span>Categories</span></div>
              </div>
              <div className="about-skills">
                {['Java Spring Boot', 'React.js', 'MySQL', 'JWT Auth', 'REST APIs'].map(s => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>
            <div className="about-right">
              <div className="dev-card">
                <div className="dev-avatar">PR</div>
                <h3>Pratham Rathod</h3>
                <p className="dev-role">Full Stack Java Developer</p>
                <p className="dev-loc">📍 Pune, Maharashtra</p>
                <div className="dev-links">
                  <a href="mailto:prathamrathod200@gmail.com" className="dev-link">📧 Email</a>
                  <a href="https://github.com/mrprathm" target="_blank" rel="noreferrer" className="dev-link">🐙 GitHub</a>
                  <a href="tel:+919890394356" className="dev-link">📞 Call</a>
                </div>
                <div className="dev-edu">
                  <p>🎓 B.E. IT — D.Y. Patil, Pune (CGPA: 8.10)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="section contact-section" id="contact" ref={contactRef}>
        <div className="page-container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>📬 Contact Us</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>We'd love to hear from you!</p>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item"><span>📧</span><div><strong>Email</strong><p>prathamrathod200@gmail.com</p></div></div>
              <div className="contact-item"><span>📞</span><div><strong>Phone</strong><p>+91-9890394356</p></div></div>
              <div className="contact-item"><span>📍</span><div><strong>Location</strong><p>Pune, Maharashtra, India</p></div></div>
              <div className="contact-item"><span>🐙</span><div><strong>GitHub</strong><p>github.com/mrprathm</p></div></div>
              <div className="contact-item"><span>⏰</span><div><strong>Support Hours</strong><p>Mon–Sat: 9 AM – 8 PM IST</p></div></div>
            </div>
            <form className="contact-form card" onSubmit={e => { e.preventDefault(); alert('Message sent! We will get back to you soon. 😊'); e.target.reset(); }}>
              <h3>Send a Message</h3>
              <div className="form-group"><label>Your Name</label><input placeholder="Pratham Rathod" required /></div>
              <div className="form-group"><label>Email</label><input type="email" placeholder="you@example.com" required /></div>
              <div className="form-group"><label>Subject</label><input placeholder="How can we help?" required /></div>
              <div className="form-group"><label>Message</label><textarea rows={4} placeholder="Write your message here..." required style={{ resize: 'vertical' }} /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send Message 📤</button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="page-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">🛒 Rathod Store</div>
              <p>Premium E-Commerce platform built with Java Spring Boot & React.js</p>
              <p style={{ marginTop: '8px', color: 'var(--accent)' }}>by <strong>Pratham Rathod</strong></p>
              <div className="footer-social">
                <a href="https://github.com/mrprathm" target="_blank" rel="noreferrer">🐙</a>
                <a href="mailto:prathamrathod200@gmail.com">📧</a>
                <a href="tel:+919890394356">📞</a>
              </div>
            </div>
            <div className="footer-col"><h5>Quick Links</h5><Link to="/">Home</Link><Link to="/products">Products</Link><Link to="/login">Login</Link><Link to="/register">Register</Link></div>
            <div className="footer-col"><h5>Categories</h5>{categories.map(c => <Link key={c.id} to={`/products?category=${c.id}&name=${c.name}`}>{c.name}</Link>)}</div>
            <div className="footer-col"><h5>Support</h5><a href="#track">Track Order</a><a href="#about">About Us</a><a href="#contact">Contact</a><a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer">API Docs</a></div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 Rathod Store. Developed by <strong>Pratham Rathod</strong> | Spring Boot + React.js</p>
            <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="swagger-btn">📚 Swagger UI</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Home;
