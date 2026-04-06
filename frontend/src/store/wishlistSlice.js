import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistApi } from '../api/index.js';
import toast from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async () => {
  const { data } = await wishlistApi.get();
  return data;
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, { getState }) => {
  const { wishlist } = getState();
  const isWishlisted = wishlist.items.some(i => i.id === productId);
  if (isWishlisted) {
    await wishlistApi.remove(productId);
    toast.success('Removed from wishlist');
  } else {
    await wishlistApi.add(productId);
    toast.success('Added to wishlist ❤️');
  }
  const { data } = await wishlistApi.get();
  return data;
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, { payload }) => { state.items = payload || []; })
      .addCase(toggleWishlist.fulfilled, (state, { payload }) => { state.items = payload || []; });
  },
});

export default wishlistSlice.reducer;

