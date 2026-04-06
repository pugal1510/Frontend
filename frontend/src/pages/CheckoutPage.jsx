import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { orderApi, paymentApi, profileApi, couponApi } from '../api/index.js';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' });

  const shippingCharge = totalAmount >= 999 ? 0 : 60;
  const finalAmount = totalAmount + shippingCharge - couponDiscount;

  useEffect(() => {
    profileApi.getAddresses()
      .then(r => {
        setAddresses(r.data);
        const def = r.data.find(a => a.isDefault) || r.data[0];
        if (def) setSelectedAddress(def.id);
      })
      .catch(() => {});
  }, []);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const { data } = await couponApi.apply(couponCode, totalAmount);
      setCouponDiscount(data.discountAmount);
      toast.success(`Coupon applied! You saved ₹${data.discountAmount}`);
    } catch {
      toast.error('Invalid or expired coupon');
    }
  };

  const saveAddress = async () => {
    try {
      const { data } = await profileApi.addAddress(newAddress);
      setAddresses(prev => [...prev, data]);
      setSelectedAddress(data.id);
      setShowAddressForm(false);
      toast.success('Address saved!');
    } catch {
      toast.error('Could not save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    setPlacing(true);
    try {
      const { data: order } = await orderApi.place({
        addressId: selectedAddress,
        paymentMethod,
        couponCode: couponCode || null,
      });

      if (paymentMethod === 'COD') {
        toast.success('Order placed successfully! 🎉');
        navigate(`/orders/${order.id}`);
        return;
      }

      const { data: rzpData } = await paymentApi.createOrder(order.id);
      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount * 100,
        currency: 'INR',
        name: 'The Kurta Store',
        description: `Order #${order.orderNumber}`,
        order_id: rzpData.razorpayOrderId,
        handler: async (response) => {
          try {
            const { data: verifyData } = await paymentApi.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            if (verifyData.success) {
              toast.success('Payment successful! 🎉');
              navigate(`/orders/${order.id}`);
            }
          } catch { toast.error('Payment verification failed'); }
        },
        prefill: { name: user?.name || 'Customer', email: user?.email || '' },
        theme: { color: '#f59e0b' },
        modal: { ondismiss: () => { setPlacing(false); } },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <h2 className="font-bold text-lg mb-4">📍 Delivery Address</h2>
            {addresses.map(addr => (
              <label key={addr.id} className="flex gap-3 p-4 border rounded-xl mb-3 cursor-pointer hover:border-amber-400">
                <input type="radio" name="address" value={addr.id}
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)} />
                <div>
                  <p className="font-semibold">{addr.fullName}
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{addr.phone}</span>
                  </p>
                  <p className="text-gray-600 text-sm">{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
              </label>
            ))}
            {showAddressForm ? (
              <div className="border rounded-xl p-4 mt-2 space-y-3">
                {Object.keys(newAddress).map(field => (
                  <input key={field} placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
                    value={newAddress[field]}
                    onChange={e => setNewAddress(a => ({ ...a, [field]: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                ))}
                <div className="flex gap-2">
                  <button onClick={saveAddress} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600">Save</button>
                  <button onClick={() => setShowAddressForm(false)} className="border px-4 py-2 rounded-lg text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddressForm(true)} className="text-amber-600 font-semibold text-sm mt-2">+ Add New Address</button>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <h2 className="font-bold text-lg mb-4">💳 Payment Method</h2>
            {[
              { value: 'ONLINE', label: '💳 Online Payment', sub: 'Cards, UPI, Net Banking via Razorpay' },
              { value: 'COD', label: '💵 Cash on Delivery', sub: 'Pay when you receive' },
            ].map(pm => (
              <label key={pm.value} className="flex gap-3 p-4 border rounded-xl mb-3 cursor-pointer hover:border-amber-400">
                <input type="radio" name="payment" value={pm.value}
                  checked={paymentMethod === pm.value}
                  onChange={() => setPaymentMethod(pm.value)} />
                <div>
                  <p className="font-semibold">{pm.label}</p>
                  <p className="text-gray-500 text-sm">{pm.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <img src={item.productImage || '/placeholder.jpg'} alt="" className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.productName}</p>
                    <p className="text-gray-500">{item.size} · ×{item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.totalPrice}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-4">
              <input value={couponCode} onChange={e => setCouponCode(e.target.value)}
                placeholder="Coupon code" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
              <button onClick={applyCoupon} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700">Apply</button>
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{totalAmount}</span></div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shippingCharge === 0 ? 'text-green-600 font-semibold' : ''}>
                  {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span><span>- ₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total</span><span>₹{finalAmount}</span>
              </div>
            </div>
            <button onClick={handlePlaceOrder} disabled={placing}
              className="w-full mt-4 bg-amber-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-amber-600 disabled:opacity-50 transition-colors">
              {placing ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order' : `Pay ₹${finalAmount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

