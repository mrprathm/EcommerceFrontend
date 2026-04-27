import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '0');
  const categoryId = searchParams.get('category');
  const categoryName = searchParams.get('name');
  const search = searchParams.get('search');

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      try {
        let res;
        if (search) res = await productAPI.search(search, page);
        else if (categoryId) res = await productAPI.getByCategory(categoryId, page);
        else res = await productAPI.getAll(page);
        setProducts(res.data.data?.content || []);
        setTotalPages(res.data.data?.totalPages || 0);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [page, categoryId, search]);

  const handleCategory = (id, name) => {
    setSearchParams(id ? { category: id, name } : {});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.elements.search.value;
    if (val) setSearchParams({ search: val });
    else setSearchParams({});
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="page-container">
          <h1 className="section-title">
            {search ? `Results: "${search}"` : categoryName ? `📂 ${categoryName}` : '🛍️ All Products'}
          </h1>
          <form onSubmit={handleSearch} className="products-search">
            <input name="search" placeholder="Search products..." defaultValue={search || ''} />
            <button type="submit" className="btn btn-primary">Search</button>
            {(search || categoryId) && (
              <button type="button" className="btn btn-outline" onClick={() => setSearchParams({})}>Clear</button>
            )}
          </form>
        </div>
      </div>

      <div className="page-container products-layout">
        {/* Sidebar */}
        <aside className="categories-sidebar">
          <h3>Categories</h3>
          <button className={`cat-filter-btn ${!categoryId && !search ? 'active' : ''}`} onClick={() => handleCategory(null, null)}>
            🛍️ All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat-filter-btn ${categoryId === String(cat.id) ? 'active' : ''}`}
              onClick={() => handleCategory(cat.id, cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </aside>

        {/* Products Grid */}
        <main className="products-main">
          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div>Loading products...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <>
              <p className="products-count">{products.length} products found</p>
              <div className="grid-products">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  <button className="btn btn-outline" disabled={page === 0}
                    onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: page - 1})}>
                    ← Prev
                  </button>
                  <span>{page + 1} / {totalPages}</span>
                  <button className="btn btn-outline" disabled={page >= totalPages - 1}
                    onClick={() => setSearchParams({...Object.fromEntries(searchParams), page: page + 1})}>
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
