// ==================== src/components/ProductCard.jsx ====================
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const isWishlisted = wishlistItems.some(i => i.id === product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product.id));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    // Simplified - in reality you'd need variant selection
    dispatch(addToCart({ productId: product.id, variantId: null, quantity: 1 }));
  };

  const discountPercent = product.discountPercent;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={`/products/${product.id}`} className="block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 group">
          {/* Image */}
          <div className="relative overflow-hidden bg-stone-50 aspect-[3/4]">
            <img
              src={product.primaryImage || '/placeholder-kurta.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {Math.round(discountPercent)}% OFF
              </span>
            )}
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleWishlist}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                {isWishlisted
                  ? <AiFillHeart className="text-red-500" />
                  : <FiHeart className="text-gray-600" />
                }
              </button>
            </div>
            {/* Quick Add Button */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button onClick={handleAddToCart}
                      className="w-full bg-gray-900 text-white py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-amber-500 transition-colors">
                <FiShoppingBag /> Quick Add
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="text-gray-800 font-medium text-sm line-clamp-2 mb-1">{product.name}</p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">
                ₹{Math.round(product.sellingPrice || product.basePrice)}
              </span>
              {discountPercent > 0 && (
                <span className="text-gray-400 text-sm line-through">₹{Math.round(product.basePrice)}</span>
              )}
            </div>
            {product.averageRating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-amber-400 text-xs">★</span>
                <span className="text-xs text-gray-500">{product.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}


// ==================== src/components/Navbar.jsx ====================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { logout } from '../store/authSlice';
import { toggleCart } from '../store/cartSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { totalItems } = useSelector(state => state.cart);
  const wishlistCount = useSelector(state => state.wishlist.items.length);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
  };

  const NAV_LINKS = [
    { label: 'New Arrivals', to: '/products?type=new' },
    { label: 'Kurta Sets', to: '/products?category=kurta-set' },
    { label: 'Wedding', to: '/products?category=wedding' },
    { label: 'Temple Wear', to: '/products?category=temple' },
    { label: 'Sale 🔥', to: '/products?type=sale' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-stone-100 shadow-sm">
      {/* Top strip */}
      <div className="bg-gray-900 text-white text-center text-xs py-2">
        🚚 Free shipping on orders above ₹999 | Use code KURTA10 for 10% off
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            The Kurta Store
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link key={link.label} to={link.to}
                    className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center border rounded-full px-3 py-1.5 gap-2 bg-gray-50">
              <FiSearch className="text-gray-400" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                     placeholder="Search kurtas..." className="bg-transparent outline-none text-sm w-40" />
            </form>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative">
              <FiHeart className="text-xl text-gray-700 hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button onClick={() => dispatch(toggleCart())} className="relative">
              <FiShoppingBag className="text-xl text-gray-700 hover:text-amber-600 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User */}
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)}>
                <FiUser className="text-xl text-gray-700 hover:text-amber-600 transition-colors" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50">My Profile</Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">My Orders</Link>
                      <Link to="/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-50">Wishlist</Link>
                      <hr className="my-1" />
                      <button onClick={() => dispatch(logout())}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 text-sm hover:bg-gray-50">Login</Link>
                      <Link to="/register" className="block px-4 py-2 text-sm hover:bg-gray-50">Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t py-4 space-y-3">
            {NAV_LINKS.map(link => (
              <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)}
                    className="block text-gray-700 font-medium py-2">
                {link.label}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="flex items-center border rounded-full px-3 py-2 gap-2 bg-gray-50">
              <FiSearch className="text-gray-400" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                     placeholder="Search kurtas..." className="bg-transparent outline-none text-sm flex-1" />
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}


// ==================== src/components/CartDrawer.jsx ====================
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { closeCart, removeFromCart, updateCartQty } from '../store/cartSlice';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { isOpen, items, totalAmount } = useSelector(state => state.cart);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())} />

          {/* Drawer */}
          <motion.div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}>

            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="font-bold text-lg">My Cart ({items.length})</h2>
              <button onClick={() => dispatch(closeCart())}>
                <FiX className="text-xl hover:text-red-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-4xl mb-4">🛒</p>
                  <p className="text-gray-500">Your cart is empty</p>
                  <button onClick={() => dispatch(closeCart())}
                          className="mt-4 text-amber-600 font-medium hover:underline">
                    Continue Shopping
                  </button>
                </div>
              ) : items.map(item => (
                <div key={item.id} className="flex gap-4 bg-stone-50 rounded-xl p-3">
                  <img src={item.productImage || '/placeholder.jpg'} alt=""
                       className="w-16 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-2">{item.productName}</p>
                    <p className="text-gray-500 text-xs">{item.size} · {item.color}</p>
                    <p className="font-bold text-amber-600 mt-1">₹{item.totalPrice}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => dispatch(updateCartQty({ itemId: item.id, quantity: item.quantity - 1 }))}
                              disabled={item.quantity <= 1}
                              className="w-6 h-6 border rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30">
                        <FiMinus className="text-xs" />
                      </button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => dispatch(updateCartQty({ itemId: item.id, quantity: item.quantity + 1 }))}
                              className="w-6 h-6 border rounded-full flex items-center justify-center hover:bg-gray-100">
                        <FiPlus className="text-xs" />
                      </button>
                      <button onClick={() => dispatch(removeFromCart(item.id))}
                              className="ml-auto text-red-400 hover:text-red-600">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-5">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
                <Link to="/checkout" onClick={() => dispatch(closeCart())}
                      className="block w-full bg-amber-500 text-white text-center py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors">
                  Proceed to Checkout →
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


// ==================== src/App.jsx ====================
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/index.js';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
// import ProductDetailPage from './pages/ProductDetailPage';
// import CartPage from './pages/CartPage';
// import CheckoutPage from './pages/CheckoutPage';
// import OrderTrackingPage from './pages/OrderTrackingPage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import ProfilePage from './pages/ProfilePage';

function AppContent() {
  return (
    <BrowserRouter>
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        {/* <Route path="/products/:id" element={<ProductDetailPage />} /> */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
        {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
        {/* <Route path="/orders/:id" element={<OrderTrackingPage />} /> */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
