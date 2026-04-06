import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-14 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="font-bold text-xl mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            The Kurta Store
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Premium South Indian ethnic wear crafted with love and tradition.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiInstagram /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiFacebook /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiTwitter /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/products?type=new" className="hover:text-white">New Arrivals</Link></li>
            <li><Link to="/products?category=wedding" className="hover:text-white">Wedding Collection</Link></li>
            <li><Link to="/products?type=sale" className="hover:text-white">Sale</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-semibold mb-3">Customer Care</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/orders" className="hover:text-white">Track Order</Link></li>
            <li><a href="#" className="hover:text-white">Return Policy</a></li>
            <li><a href="#" className="hover:text-white">Size Guide</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">Get in Touch</h4>
          <p className="text-gray-400 text-sm">support@thekurtastore.in</p>
          <p className="text-gray-400 text-sm mt-1">+91 98765 43210</p>
          <p className="text-gray-400 text-sm mt-1">Mon–Sat, 10am–7pm</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-gray-800 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} The Kurta Store. All rights reserved.
      </div>
    </footer>
  );
}

