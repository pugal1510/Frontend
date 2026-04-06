import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderApi } from '../api/index.js';

const STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getById(id)
      .then(r => setOrder(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderApi.cancel(id);
      toast.success('Order cancelled');
      setOrder(o => ({ ...o, status: 'CANCELLED' }));
    } catch {
      toast.error('Cannot cancel this order');
    }
  };

  const handleReturn = async () => {
    const reason = window.prompt('Please state your return reason:');
    if (!reason) return;
    try {
      await orderApi.requestReturn(id, reason);
      toast.success('Return request submitted');
      setOrder(o => ({ ...o, status: 'RETURN_REQUESTED' }));
    } catch {
      toast.error('Cannot request return');
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );

  if (!order) return <div className="text-center py-20 text-gray-500">Order not found.</div>;

  const currentStep = STEPS.indexOf(order.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to="/orders" className="text-amber-600 text-sm hover:underline mb-6 block">← Back to Orders</Link>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
            {order.status?.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Progress Bar */}
        {!['CANCELLED', 'RETURN_REQUESTED'].includes(order.status) && (
          <div className="mt-8">
            <div className="flex justify-between mb-2">
              {STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center text-xs text-center w-1/4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 text-sm
                    ${i <= currentStep ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <span className={i <= currentStep ? 'text-amber-600 font-semibold' : 'text-gray-400'}>
                    {step.charAt(0) + step.slice(1).toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative h-1 bg-gray-100 rounded-full mt-2">
              <div className="absolute h-1 bg-amber-500 rounded-full transition-all"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
        <h2 className="font-bold mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {order.items?.map(item => (
            <div key={item.id} className="flex gap-3">
              <img src={item.productImage || '/placeholder.jpg'} alt="" className="w-14 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.productName}</p>
                <p className="text-gray-500 text-xs">{item.size} · ×{item.quantity}</p>
              </div>
              <p className="font-semibold text-sm">₹{item.totalPrice}</p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Address */}
      {order.address && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
          <h2 className="font-bold mb-2">Delivery Address</h2>
          <p className="text-gray-700 text-sm">{order.address.fullName}</p>
          <p className="text-gray-600 text-sm">{order.address.addressLine1}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {order.status === 'PENDING' && (
          <button onClick={handleCancel}
            className="flex-1 border-2 border-red-400 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors">
            Cancel Order
          </button>
        )}
        {order.status === 'DELIVERED' && (
          <button onClick={handleReturn}
            className="flex-1 border-2 border-amber-400 text-amber-600 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors">
            Request Return
          </button>
        )}
      </div>
    </div>
  );
}

