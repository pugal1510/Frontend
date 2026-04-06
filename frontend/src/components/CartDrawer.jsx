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
                      <button
                        onClick={() => dispatch(updateCartQty({ itemId: item.id, quantity: item.quantity - 1 }))}
                        disabled={item.quantity <= 1}
                        className="w-6 h-6 border rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30">
                        <FiMinus className="text-xs" />
                      </button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateCartQty({ itemId: item.id, quantity: item.quantity + 1 }))}
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

