import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { AiFillHeart, AiFillStar } from 'react-icons/ai';
import { productApi } from '../api/index.js';
import { addToCart } from '../store/cartSlice.js';
import { toggleWishlist } from '../store/wishlistSlice.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = wishlistItems.some(i => i.id === Number(id));

  useEffect(() => {
    setLoading(true);
    productApi.getById(id)
      .then(r => {
        setProduct(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    productApi.getReviews(id)
      .then(r => setReviews(r.data.content || r.data || []))
      .catch(() => {});
  }, [id]);

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="h-[500px] bg-gray-100 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20 text-gray-500">Product not found.</div>
  );

  const images = product.images?.length > 0 ? product.images : [product.primaryImage].filter(Boolean);
  const sizes = product.variants ? [...new Set(product.variants.map(v => v.size))] : [];

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    const variant = product.variants?.find(v => v.size === selectedSize);
    dispatch(addToCart({ productId: product.id, variantId: variant?.id || null, quantity }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-stone-50 mb-3 aspect-[3/4]">
            <img
              src={images[selectedImage] || '/placeholder-kurta.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${selectedImage === i ? 'border-amber-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {product.name}
          </h1>

          {product.averageRating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  i < Math.round(product.averageRating)
                    ? <AiFillStar key={i} />
                    : <FiStar key={i} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount || 0} reviews)</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl font-bold text-gray-900">
              ₹{Math.round(product.sellingPrice || product.basePrice)}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{Math.round(product.basePrice)}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">
                  {Math.round(product.discountPercent)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-5">
              <p className="font-semibold text-sm mb-2">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${selectedSize === s ? 'bg-amber-500 text-white border-amber-500' : 'hover:border-amber-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-6">
            <p className="font-semibold text-sm">Quantity</p>
            <div className="flex items-center gap-2 border rounded-full px-3 py-1">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-lg font-bold px-1">−</button>
              <span className="w-6 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-lg font-bold px-1">+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 bg-amber-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors">
              <FiShoppingBag /> Add to Cart
            </motion.button>
            <button onClick={() => dispatch(toggleWishlist(product.id))}
              className="w-12 h-12 border-2 rounded-xl flex items-center justify-center hover:border-red-400 transition-colors">
              {isWishlisted ? <AiFillHeart className="text-red-500 text-xl" /> : <FiHeart className="text-xl" />}
            </button>
          </div>

          {/* Product Details */}
          {product.fabric && (
            <div className="mt-6 p-4 bg-stone-50 rounded-xl text-sm text-gray-600 space-y-1">
              {product.fabric && <p><span className="font-semibold">Fabric:</span> {product.fabric}</p>}
              {product.color && <p><span className="font-semibold">Color:</span> {product.color}</p>}
              {product.occasion && <p><span className="font-semibold">Occasion:</span> {product.occasion}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{review.userName || 'Customer'}</p>
                  <div className="flex text-amber-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      i < review.rating ? <AiFillStar key={i} /> : <FiStar key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

