import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { productApi } from '../api/index.js';
import ProductCard from '../components/ProductCard.jsx';

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
        {products.length > 0
          ? products.map(p => <ProductCard key={p.id} product={p} />)
          : [...Array(8)].map((_, i) => <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />)
        }
      </div>
    </section>
  );
}

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    productApi.getFeatured('NEW_ARRIVALS').then(r => setNewArrivals(r.data.slice(0, 8))).catch(() => {});
    productApi.getFeatured('BEST_SELLERS').then(r => setBestSellers(r.data.slice(0, 8))).catch(() => {});
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
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ffd700 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
              <motion.div className="text-center text-white z-10 px-4"
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}>
                <span className="bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full tracking-widest">
                  {banner.tag}
                </span>
                <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
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

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Shop by Category
        </h2>
        <p className="text-center text-gray-500 mb-10">Find your perfect style</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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

      <ProductSection title="New Arrivals" subtitle="Fresh from the workshop" products={newArrivals} viewAllLink="/products?type=new" />

      {/* FESTIVAL BANNER */}
      <section className="my-8 mx-4">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', minHeight: '220px' }}>
          <div className="flex flex-col md:flex-row items-center justify-between p-12">
            <div className="text-white">
              <p className="text-amber-300 font-semibold tracking-widest text-sm">🪔 FESTIVE SPECIAL</p>
              <h3 className="text-4xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Festive Collection
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

      <ProductSection title="Best Sellers" subtitle="Our customers' favourites" products={bestSellers} viewAllLink="/products?type=best" />

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

