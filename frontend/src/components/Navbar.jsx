import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { logout } from '../store/authSlice';
import { toggleCart } from '../store/cartSlice';

const NAV_LINKS = [
  { label: 'New Arrivals', to: '/products?type=new' },
  { label: 'Kurta Sets', to: '/products?category=kurta-set' },
  { label: 'Wedding', to: '/products?category=wedding' },
  { label: 'Temple Wear', to: '/products?category=temple' },
  { label: 'Sale 🔥', to: '/products?type=sale' },
];

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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-stone-100 shadow-sm">
      {/* Announcement strip */}
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

            {/* User Menu */}
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)}>
                <FiUser className="text-xl text-gray-700 hover:text-amber-600 transition-colors" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">My Profile</Link>
                      <Link to="/orders" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">My Orders</Link>
                      <Link to="/wishlist" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Wishlist</Link>
                      <hr className="my-1" />
                      <button onClick={() => { dispatch(logout()); setShowUserMenu(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Login</Link>
                      <Link to="/register" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
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

