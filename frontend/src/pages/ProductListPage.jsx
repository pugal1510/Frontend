import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import { productApi } from '../api/index.js';
import ProductCard from '../components/ProductCard.jsx';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const FABRICS = ['Cotton', 'Silk', 'Linen', 'Khadi', 'Georgette'];
const SORT_OPTIONS = [
  { label: 'Newest First', sortBy: 'createdAt', sortDir: 'DESC' },
  { label: 'Price: Low to High', sortBy: 'basePrice', sortDir: 'ASC' },
  { label: 'Price: High to Low', sortBy: 'basePrice', sortDir: 'DESC' },
  { label: 'Most Popular', sortBy: 'reviewCount', sortDir: 'DESC' },
];

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    size: '', color: '', fabric: '', minPrice: '', maxPrice: '', sortBy: 'createdAt', sortDir: 'DESC',
  });

  const category = searchParams.get('category');
  const q = searchParams.get('q');

  useEffect(() => {
    setLoading(true);
    const params = { ...filters, page, pageSize: 12 };
    if (category) params.category = category;

    (q ? productApi.search(q, page) : productApi.getAll(params))
      .then(r => {
        setProducts(r.data.content || r.data || []);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [filters, page, category, q]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {q ? `Search: "${q}"` : category ? category.replace('-', ' ').toUpperCase() : 'All Products'}
          </h1>
          <p className="text-gray-500">{products.length} products found</p>
        </div>
        <div className="flex gap-3">
          <select className="border rounded-lg px-3 py-2 text-sm"
            onChange={e => {
              const opt = SORT_OPTIONS[e.target.value];
              setFilters(f => ({ ...f, sortBy: opt.sortBy, sortDir: opt.sortDir }));
            }}>
            {SORT_OPTIONS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        {showFilters && (
          <aside className="w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Filters</h3>
                <button onClick={() => setFilters({ size: '', color: '', fabric: '', minPrice: '', maxPrice: '', sortBy: 'createdAt', sortDir: 'DESC' })}
                  className="text-amber-600 text-sm">Clear All</button>
              </div>

              {/* Size */}
              <div className="mb-5">
                <p className="font-semibold text-sm mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setFilters(f => ({ ...f, size: f.size === s ? '' : s }))}
                      className={`px-3 py-1 rounded-full text-sm border ${filters.size === s ? 'bg-amber-500 text-white border-amber-500' : 'hover:border-amber-400'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric */}
              <div className="mb-5">
                <p className="font-semibold text-sm mb-2">Fabric</p>
                {FABRICS.map(f => (
                  <label key={f} className="flex items-center gap-2 mb-1 cursor-pointer">
                    <input type="radio" name="fabric" checked={filters.fabric === f}
                      onChange={() => setFilters(ff => ({ ...ff, fabric: f }))} />
                    <span className="text-sm">{f}</span>
                  </label>
                ))}
              </div>

              {/* Price Range */}
              <div>
                <p className="font-semibold text-sm mb-2">Price Range</p>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice}
                    onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                    className="w-full border rounded px-2 py-1 text-sm" />
                  <input type="number" placeholder="Max" value={filters.maxPrice}
                    onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                    className="w-full border rounded px-2 py-1 text-sm" />
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(12)].map((_, i) => <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
              {products.length === 0 && (
                <div className="col-span-4 text-center py-20 text-gray-400">No products found.</div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`w-10 h-10 rounded-full text-sm font-medium ${page === i ? 'bg-amber-500 text-white' : 'border hover:bg-gray-50'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

