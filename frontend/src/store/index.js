// ==================== src/store/store.js ====================
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export default store;


// ==================== src/store/authSlice.js ====================
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/index.js';
import toast from 'react-hot-toast';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authApi.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authApi.register(userData);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      state.user = null;
      state.isAuthenticated = false;
      toast.success('Logged out successfully');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = { email: action.payload.email, role: action.payload.role };
        toast.success('Welcome back! 🎉');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = { email: action.payload.email, role: action.payload.role };
        toast.success('Account created! 🎊');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;


// ==================== src/store/cartSlice.js ====================
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


// ==================== src/store/wishlistSlice.js ====================
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
