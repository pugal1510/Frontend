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
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {Math.round(discountPercent)}% OFF
              </span>
            )}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleWishlist}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                {isWishlisted
                  ? <AiFillHeart className="text-red-500" />
                  : <FiHeart className="text-gray-600" />}
              </button>
            </div>
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

