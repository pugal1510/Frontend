// ==================== src/pages/HomePage.jsx ====================
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { productApi } from '../api/index.js';
import ProductCard from '../components/ProductCard';

const HERO_BANNERS = [
  { id: 1, title: 'New Arrivals', subtitle: 'Elegant South Indian Kurtas', tag: 'NEW COLLECTION', bg: '#1a1a2e', cta: '/products?type=new' },
  { id: 2, title: 'Wedding Special', subtitle: 'Premium Silk & Brocade Kurtas', tag: 'FESTIVE SEASON', bg: '#16213e', cta: '/products?category=wedding' },
  { id: 3, title: 'Temple Wear', subtitle: 'Graceful Cotton Kurta Sets', tag: 'DIVINE COLLECTION', bg: '#0f3460', cta: '/products?category=temple' },
];

const CATEGORIES = [
  { id: 1, name: 'Kurta', slug: 'kurta', emoji: '👘', desc: 'Classic Everyday' },
  { id: 2, name: 'Kurta Sets', slug: 'kurta-set', emoji: '🥻', desc: 'Complete Look' },
  { id: 3, name: 'Wedding', slug: 'wedding', emoji: '💍', desc: 'Festive & Bridal' },
  { id: 4, name: 'Temple Wear', slug: 'temple', emoji: '🪔', desc: 'Divine Elegance' },
  { id: 5, name: 'Casual', slug: 'casual', emoji: '✨', desc: 'Daily Comfort' },
];

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    productApi.getFeatured('NEW_ARRIVALS').then(r => setNewArrivals(r.data.slice(0, 8)));
    productApi.getFeatured('BEST_SELLERS').then(r => setBestSellers(r.data.slice(0, 8)));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* HERO BANNER */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
        className="h-[85vh] w-full"
      >
        {HERO_BANNERS.map(banner => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-full flex items-center justify-center"
                 style={{ background: `linear-gradient(135deg, ${banner.bg} 0%, #2d1b69 100%)` }}>
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10"
                   style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ffd700 1px, transparent 1px), radial-gradient(circle at 80% 50%, #ffd700 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
              <motion.div className="text-center text-white z-10 px-4"
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}>
                <span className="bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full tracking-widest">
                  {banner.tag}
                </span>
                <h1 className="text-6xl font-bold mt-4 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {banner.title}
                </h1>
                <p className="text-xl text-amber-100 mb-8">{banner.subtitle}</p>
                <Link to={banner.cta}
                  className="bg-amber-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-amber-300 transition-all hover:scale-105 inline-block">
                  Explore Collection →
                </Link>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Shop by Category
        </h2>
        <p className="text-center text-gray-500 mb-10">Find your perfect style</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}>
              <Link to={`/products?category=${cat.slug}`}
                className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-stone-100 group">
                <span className="text-4xl mb-3">{cat.emoji}</span>
                <span className="font-semibold text-gray-800 group-hover:text-amber-600">{cat.name}</span>
                <span className="text-xs text-gray-400 mt-1">{cat.desc}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <ProductSection title="New Arrivals" subtitle="Fresh from the workshop" products={newArrivals}
                       viewAllLink="/products?type=new" />

      {/* FESTIVAL BANNER */}
      <section className="my-8 mx-4">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative"
             style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', minHeight: '220px' }}>
          <div className="flex flex-col md:flex-row items-center justify-between p-12">
            <div className="text-white">
              <p className="text-amber-300 font-semibold tracking-widest text-sm">🪔 DIWALI SPECIAL</p>
              <h3 className="text-4xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Festive Collection 2024
              </h3>
              <p className="text-purple-100 mt-2">Up to 40% off on premium ethnic wear</p>
            </div>
            <Link to="/products?occasion=festival"
              className="mt-6 md:mt-0 bg-white text-purple-700 px-8 py-3 rounded-full font-bold hover:bg-amber-300 transition-colors">
              Shop Festival Wear
            </Link>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <ProductSection title="Best Sellers" subtitle="Our customers' favourites" products={bestSellers}
                       viewAllLink="/products?type=best" />

      {/* USP STRIP */}
      <section className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: '🚚', label: 'Free Shipping', sub: 'Orders above ₹999' },
            { icon: '↩️', label: 'Easy Returns', sub: '7-day return policy' },
            { icon: '🔒', label: 'Secure Payment', sub: 'Razorpay & COD' },
            { icon: '⭐', label: '4.8/5 Rating', sub: '10,000+ happy customers' },
          ].map(u => (
            <div key={u.label}>
              <div className="text-3xl mb-2">{u.icon}</div>
              <div className="font-semibold">{u.label}</div>
              <div className="text-gray-400 text-sm">{u.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductSection({ title, subtitle, products, viewAllLink }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h2>
          <p className="text-gray-500">{subtitle}</p>
        </div>
        <Link to={viewAllLink} className="text-amber-600 font-semibold hover:underline">View All →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
        {products.length === 0 && [...Array(8)].map((_, i) => (
          <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    </section>
  );
}


// ==================== src/pages/ProductListPage.jsx ====================
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    size: '', color: '', fabric: '', minPrice: '', maxPrice: '', sortBy: 'createdAt', sortDir: 'DESC'
  });

  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const q = searchParams.get('q');

  useEffect(() => {
    setLoading(true);
    const params = { ...filters, page, pageSize: 12 };
    if (category) params.category = category;

    (q ? productApi.search(q, page) : productApi.getAll(params))
      .then(r => {
        setProducts(r.data.content || r.data);
        setTotalPages(r.data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [filters, page, category, q]);

  const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
  const FABRICS = ['Cotton', 'Silk', 'Linen', 'Khadi', 'Georgette'];
  const SORT_OPTIONS = [
    { label: 'Newest First', sortBy: 'createdAt', sortDir: 'DESC' },
    { label: 'Price: Low to High', sortBy: 'basePrice', sortDir: 'ASC' },
    { label: 'Price: High to Low', sortBy: 'basePrice', sortDir: 'DESC' },
    { label: 'Most Popular', sortBy: 'reviewCount', sortDir: 'DESC' },
  ];

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


// ==================== src/pages/CheckoutPage.jsx ====================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { orderApi, paymentApi, profileApi, couponApi } from '../api/index.js';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector(state => state.cart);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);

  const shippingCharge = totalAmount >= 999 ? 0 : 60;
  const finalAmount = totalAmount + shippingCharge - couponDiscount;

  useEffect(() => {
    profileApi.getAddresses().then(r => {
      setAddresses(r.data);
      setSelectedAddress(r.data.find(a => a.isDefault)?.id || r.data[0]?.id);
    });
  }, []);

  const applyCoupon = async () => {
    try {
      const { data } = await couponApi.apply(couponCode, totalAmount);
      setCouponDiscount(data.discountAmount);
      toast.success(`Coupon applied! You saved ₹${data.discountAmount}`);
    } catch {
      toast.error('Invalid or expired coupon');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    setPlacing(true);
    try {
      // 1. Place order
      const { data: order } = await orderApi.place({
        addressId: selectedAddress, paymentMethod,
        couponCode: couponCode || null,
      });

      if (paymentMethod === 'COD') {
        toast.success('Order placed successfully! 🎉');
        navigate(`/orders/${order.id}`);
        return;
      }

      // 2. Create Razorpay order
      const { data: rzpData } = await paymentApi.createOrder(order.id);

      // 3. Open Razorpay checkout
      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount * 100,
        currency: 'INR',
        name: 'The Kurta Store',
        description: `Order #${order.orderNumber}`,
        order_id: rzpData.razorpayOrderId,
        handler: async (response) => {
          try {
            const { data: verifyData } = await paymentApi.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            if (verifyData.success) {
              toast.success('Payment successful! 🎉');
              navigate(`/orders/${order.id}`);
            }
          } catch { toast.error('Payment verification failed'); }
        },
        prefill: { name: 'Customer', email: 'customer@example.com' },
        theme: { color: '#f59e0b' },
        modal: { ondismiss: () => { setPlacing(false); toast('Payment cancelled'); } },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Address + Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <h2 className="font-bold text-lg mb-4">📍 Delivery Address</h2>
            {addresses.map(addr => (
              <label key={addr.id} className="flex gap-3 p-4 border rounded-xl mb-3 cursor-pointer hover:border-amber-400">
                <input type="radio" name="address" value={addr.id}
                       checked={selectedAddress === addr.id}
                       onChange={() => setSelectedAddress(addr.id)} />
                <div>
                  <p className="font-semibold">{addr.fullName} <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{addr.phone}</span></p>
                  <p className="text-gray-600 text-sm">{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
              </label>
            ))}
            <button className="text-amber-600 font-semibold text-sm mt-2">+ Add New Address</button>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <h2 className="font-bold text-lg mb-4">💳 Payment Method</h2>
            {[
              { value: 'ONLINE', label: '💳 Online Payment', sub: 'Cards, UPI, Net Banking via Razorpay' },
              { value: 'COD', label: '💵 Cash on Delivery', sub: 'Pay when you receive' },
            ].map(pm => (
              <label key={pm.value} className="flex gap-3 p-4 border rounded-xl mb-3 cursor-pointer hover:border-amber-400">
                <input type="radio" name="payment" value={pm.value}
                       checked={paymentMethod === pm.value}
                       onChange={() => setPaymentMethod(pm.value)} />
                <div>
                  <p className="font-semibold">{pm.label}</p>
                  <p className="text-gray-500 text-sm">{pm.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <img src={item.productImage || '/placeholder.jpg'} alt=""
                       className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.productName}</p>
                    <p className="text-gray-500">{item.size} · ×{item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.totalPrice}</p>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-4">
              <input value={couponCode} onChange={e => setCouponCode(e.target.value)}
                     placeholder="Coupon code" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
              <button onClick={applyCoupon} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700">
                Apply
              </button>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{totalAmount}</span></div>
              <div className="flex justify-between"><span>Shipping</span>
                <span className={shippingCharge === 0 ? 'text-green-600' : ''}>
                  {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span><span>- ₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total</span><span>₹{finalAmount}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} disabled={placing}
                    className="w-full mt-4 bg-amber-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-amber-600 disabled:opacity-50 transition-colors">
              {placing ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order' : `Pay ₹${finalAmount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
