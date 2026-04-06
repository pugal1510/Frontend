import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { profileApi } from '../api/index.js';

export default function ProfilePage() {
  const { user } = useSelector(state => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' });

  useEffect(() => {
    profileApi.getAddresses()
      .then(r => setAddresses(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setForm({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' }); setEditingId(null); setShowForm(true); };
  const openEdit = (addr) => { setForm(addr); setEditingId(addr.id); setShowForm(true); };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { data } = await profileApi.updateAddress(editingId, form);
        setAddresses(a => a.map(x => x.id === editingId ? data : x));
      } else {
        const { data } = await profileApi.addAddress(form);
        setAddresses(a => [...a, data]);
      }
      setShowForm(false);
      toast.success(editingId ? 'Address updated!' : 'Address added!');
    } catch {
      toast.error('Could not save address');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await profileApi.deleteAddress(id);
      setAddresses(a => a.filter(x => x.id !== id));
      toast.success('Address deleted');
    } catch {
      toast.error('Could not delete address');
    }
  };

  const FIELDS = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'addressLine1', label: 'Address Line' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'pincode', label: 'Pincode' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-600">
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <p className="font-bold text-lg text-gray-800">{user?.name || 'My Account'}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-lg">Saved Addresses</h2>
          <button onClick={openAdd} className="text-amber-600 font-semibold text-sm hover:underline">+ Add New</button>
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id} className="flex justify-between items-start p-4 border rounded-xl hover:border-amber-300 transition-colors">
                <div>
                  <p className="font-semibold">{addr.fullName} <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{addr.phone}</span></p>
                  <p className="text-gray-600 text-sm">{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
                <div className="flex gap-2 ml-3">
                  <button onClick={() => openEdit(addr)} className="text-xs text-amber-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(addr.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
            {addresses.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No addresses saved yet.</p>}
          </div>
        )}

        {/* Address Form */}
        {showForm && (
          <div className="mt-5 border-t pt-5 space-y-3">
            <h3 className="font-semibold">{editingId ? 'Edit Address' : 'New Address'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FIELDS.map(({ key, label }) => (
                <input key={key} placeholder={label} value={form[key] || ''}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400" />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors">
                Save Address
              </button>
              <button onClick={() => setShowForm(false)} className="border px-6 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

