// src/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../API/Api';

// Async thunk to check authentication
export const checkAuthentication = createAsyncThunk(
  'user/checkAuthentication',
  async () => {
    const response = await fetch(`${baseUrl}/check`, {
      method: 'GET',
      credentials: 'include', // Important: includes cookies with the request
    });
    
    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    const data = await response.json();
    return data; // This should return user info and other details
  }
);

const initialState = {
  user: null,
  authenticated: false,
  cart: [],
  wishlists: [],
  alreadyRegistered: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.authenticated = true;
      state.alreadyRegistered = true; // Assuming login means the user is registered
    },
    logout: (state) => {
      state.user = null;
      state.authenticated = false;
      state.cart = []; // Optionally clear the cart on logout
      state.alreadyRegistered = false; // Reset registration status
    },
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload.id);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    
    verifyOTP(state, action) {
      const { user, register,cart,wishlists, rewards } = action.payload;
      state.user = user;
      state.authenticated = true; 
      state.alreadyRegistered = register === 1; 
      state.cart=cart;
      state.wishlists=wishlists;
      state.rewards = rewards;
      
    },


  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthentication.fulfilled, (state, action) => {
        const { user, register, cart, wishlists, rewards } = action.payload;
        state.user = user;
        state.authenticated = true;
        state.alreadyRegistered = register === 1;
        state.cart = cart;
        state.wishlists = wishlists;
        state.rewards = rewards;
      })
      .addCase(checkAuthentication.rejected, (state) => {
        state.user = null;
        state.authenticated = false;
        state.alreadyRegistered = false;
      });
  },
});

// Export actions and reducer as before
export const { login, logout, addToCart, removeFromCart, clearCart, verifyOTP } = userSlice.actions;
export default userSlice.reducer;
