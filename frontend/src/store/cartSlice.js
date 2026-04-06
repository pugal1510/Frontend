import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../api/index.js';
import toast from 'react-hot-toast';

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const { data } = await cartApi.get();
  return data;
});

export const addToCart = createAsyncThunk('cart/add', async (item, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.addItem(item);
    toast.success('Added to cart! 🛒');
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Could not add to cart');
    return rejectWithValue(err.response?.data);
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId) => {
  const { data } = await cartApi.removeItem(itemId);
  return data;
});

export const updateCartQty = createAsyncThunk('cart/update', async (payload) => {
  const { data } = await cartApi.updateItem(payload);
  return data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartId: null,
    items: [],
    totalAmount: 0,
    totalItems: 0,
    isOpen: false,
    loading: false,
  },
  reducers: {
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    closeCart: (state) => { state.isOpen = false; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, { payload }) => {
        state.cartId = payload.cartId;
        state.items = payload.items || [];
        state.totalAmount = payload.totalAmount || 0;
        state.totalItems = payload.totalItems || 0;
      })
      .addCase(addToCart.fulfilled, (state, { payload }) => {
        state.items = payload.items || [];
        state.totalAmount = payload.totalAmount || 0;
        state.totalItems = payload.totalItems || 0;
      })
      .addCase(removeFromCart.fulfilled, (state, { payload }) => {
        state.items = payload.items || [];
        state.totalAmount = payload.totalAmount || 0;
        state.totalItems = payload.totalItems || 0;
      })
      .addCase(updateCartQty.fulfilled, (state, { payload }) => {
        state.items = payload.items || [];
        state.totalAmount = payload.totalAmount || 0;
        state.totalItems = payload.totalItems || 0;
      });
  },
});

export const { toggleCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;

