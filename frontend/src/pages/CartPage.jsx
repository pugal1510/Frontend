import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { removeFromCart, updateCartQty } from '../store/cartSlice.js';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);
  const shippingCharge = totalAmount >= 999 ? 0 : 60;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <FiShoppingBag className="text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart ({items.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
              <img src={item.productImage || '/placeholder.jpg'} alt=""
                className="w-20 h-24 object-cover rounded-xl" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.productName}</p>
                <p className="text-gray-500 text-sm">{item.size} · {item.color}</p>
                <p className="font-bold text-amber-600 mt-1">₹{item.totalPrice}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 border rounded-full px-3 py-1">
                    <button
                      onClick={() => dispatch(updateCartQty({ itemId: item.id, quantity: item.quantity - 1 }))}
                      disabled={item.quantity <= 1}
                      className="disabled:opacity-30">
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button onClick={() => dispatch(updateCartQty({ itemId: item.id, quantity: item.quantity + 1 }))}>
                      <FiPlus className="text-xs" />
                    </button>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(item.id))} className="text-red-400 hover:text-red-600 ml-auto">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 h-fit sticky top-24">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{totalAmount}</span></div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className={shippingCharge === 0 ? 'text-green-600 font-semibold' : ''}>
                {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
              </span>
            </div>
            {shippingCharge > 0 && (
              <p className="text-xs text-gray-400">Add ₹{999 - totalAmount} more for free shipping</p>
            )}
            <div className="flex justify-between font-bold text-base pt-3 border-t">
              <span>Total</span><span>₹{totalAmount + shippingCharge}</span>
            </div>
          </div>
          <Link to="/checkout"
            className="block w-full bg-amber-500 text-white text-center py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors">
            Proceed to Checkout →
          </Link>
          <Link to="/products" className="block text-center text-sm text-amber-600 mt-3 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

