import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { fetchWishlist, toggleWishlist } from '../store/wishlistSlice.js';
import { addToCart } from '../store/cartSlice.js';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (items.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <FiHeart className="text-6xl text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
      <p className="text-gray-500 mb-6">Save items you love by clicking the heart icon.</p>
      <Link to="/products" className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors">
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {items.map(product => (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 group">
            <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
              <img src={product.primaryImage || '/placeholder-kurta.jpg'} alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </Link>
            <div className="p-3">
              <p className="font-medium text-sm text-gray-800 line-clamp-2 mb-2">{product.name}</p>
              <p className="font-bold text-gray-900 mb-3">₹{Math.round(product.sellingPrice || product.basePrice)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(addToCart({ productId: product.id, variantId: null, quantity: 1 }))}
                  className="flex-1 bg-amber-500 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-amber-600 transition-colors">
                  <FiShoppingBag /> Add to Cart
                </button>
                <button
                  onClick={() => dispatch(toggleWishlist(product.id))}
                  className="w-9 h-9 border rounded-lg flex items-center justify-center hover:border-red-400 transition-colors text-red-500">
                  ♥
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

